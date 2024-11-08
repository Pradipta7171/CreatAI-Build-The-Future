"use client";

import React, { useState, useMemo, useCallback, lazy, Suspense } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { DownloadIcon, ImagePlus } from 'lucide-react';

import Heading from "@/components/heading";
import { amountOptions, formSchema, resolutionOptions } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardFooter } from "@/components/ui/card";

const LazyImage = lazy(() => import('next/image'));

const ImagePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: "2",
      resolution: "512x512"
    }
  });

  const handleDownload = useCallback((imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'CreatiAi-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      setImages([]);

      const response = await axios.post("/api/image", values);
      let newImages: string[] = [];

      if (Array.isArray(response.data)) {
        newImages = response.data.map((item: any) => item.url || item);
      } else if (typeof response.data === 'object' && response.data.image) {
        newImages = [response.data.image];
      } else {
        console.error("Unexpected API response format:", response.data);
      }

      setImages(newImages);
      form.reset();
    } catch (error) {
      console.error("Error in image generation:", error);
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  const memoizedImages = useMemo(() => images, [images]);

  return (
    <motion.div
      className="min-h-screen p-4 bg-gradient-to-br from-fuchsia-50 via-pink-50 to-rose-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Heading
          title="Image Generator"
          description="Turn your prompt into images using AI"
          icon={ImagePlus}
          iconColor="text-pink-600"
          bgColor="bg-pink-500/10"
        />
      </motion.div>

      <motion.div
        className="px-4 lg:px-8 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div>
          <Form {...form}>
            <motion.form
              onSubmit={form.handleSubmit(onSubmit)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="rounded-lg border w-full shadow-md p-4 px-3 md:px-6 focus-within:shadow-lg grid grid-cols-12 gap-2 bg-white"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent rounded-lg text-gray-800"
                        disabled={isLoading}
                        placeholder="Describe what you'd like to see (e.g. Rainy day in New York City)"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {amountOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="resolution"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resolutionOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <Button
                className="col-span-12 lg:col-span-2 w-full bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? "Thinking..." : "Generate"}
              </Button>
            </motion.form>
          </Form>
        </div>

        <div className="space-y-4 mt-4">
          <AnimatePresence>
            {isLoading && (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="p-20"
              >
                <Loader />
              </motion.div>
            )}

            {!isLoading && images.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Empty label="No images generated till now." />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
            {memoizedImages.map((image: string | { url: string }, index) => {
              const src = typeof image === 'string' ? image : image.url;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card key={index} className="rounded-lg overflow-hidden">
                    <div className="relative aspect-square">
                      <Suspense fallback={<div>Loading...</div>}>
                        <LazyImage
                          alt={`Generated image ${index + 1}`}
                          fill
                          src={src}
                          onError={() => console.error(`Failed to load image: ${src}`)}
                        />
                      </Suspense>
                    </div>
                    <CardFooter className="p-2">
                      <Button
                        variant="secondary"
                        className="w-full bg-gradient-to-r from-pink-300 to-rose-300 hover:from-pink-300 hover:to-rose-400 text-red-900 font-semibold"
                        onClick={() => handleDownload(src)}
                      >
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ImagePage;