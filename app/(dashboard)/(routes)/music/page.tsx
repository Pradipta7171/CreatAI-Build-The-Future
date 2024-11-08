"use client";

import React, { useState, useRef, useCallback, useMemo } from 'react';
import * as z from "zod";
import { Headphones, AlertCircle, Download, FastForward, Rewind } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Heading from "@/components/heading";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { CardContent, Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from '@/components/ui/slider';

const formSchema = z.object({
  prompt: z.string().min(1, { message: "Prompt is required" }),
});

type FormValues = z.infer<typeof formSchema>;

const MusicPage: React.FC = () => {
  const [music, setMusic] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  });

  const onSubmit = useCallback(async (values: FormValues) => {
    try {
      setIsLoading(true);
      setMusic(undefined);
      setError(null);

      const response = await axios.post("/api/music", values, {
        responseType: 'arraybuffer',
      });

      const blob = new Blob([response.data], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      setMusic(url);
      form.reset();

    } catch (error) {
      console.error("Error in music creation:", error);
      let errorMessage = "An unexpected error occurred";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || error.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  const handlePlaybackRateChange = useCallback((newRate: number[]) => {
    const rate = newRate[0];
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, []);

  const handleDownload = useCallback(() => {
    if (music) {
      const link = document.createElement('a');
      link.href = music;
      link.download = 'generated-music.wav';
      link.click();
    }
  }, [music]);

  const memoizedForm = useMemo(() => (
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
            <FormItem className="col-span-12 lg:col-span-10">
              <FormControl className="m-0 p-0">
                <Input
                  className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent rounded-lg text-gray-800 transition-all duration-300"
                  disabled={isLoading}
                  placeholder="Describe what you'd like to hear (e.g. a funky house with 80s hip hop vibes)"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          className="col-span-12 lg:col-span-2 w-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 hover:from-green-500 hover:via-emerald-600 hover:to-teal-700 text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate"}
        </Button>
      </motion.form>
    </Form>
  ), [form, isLoading, onSubmit]);

  const memoizedMusicPlayer = useMemo(() => music && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <Card className="overflow-hidden border-none">
        <CardHeader className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white">
          <CardTitle className="text-xl font-bold">Your Generated Music</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <audio ref={audioRef} controls className="w-full" src={music}>
              Your browser does not support the audio element.
            </audio>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Rewind className="text-emerald-600" size={20} />
              <Slider
                min={0.5}
                max={2}
                step={0.1}
                value={[playbackRate]}
                onValueChange={handlePlaybackRateChange}
                className="w-32"
              />
              <FastForward className="text-emerald-600" size={20} />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Playback Speed: {playbackRate.toFixed(1)}x
            </span>
          </div>

          <Button
            onClick={handleDownload}
            className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
          >
            <Download className="mr-2" size={20} />
            Download Music
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  ), [music, playbackRate, handlePlaybackRateChange, handleDownload]);

  return (
    <motion.div
      className="min-h-screen p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-emerald-100"
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
          title="Music Composer"
          description="Turn your thoughts into music with our AI Composer."
          icon={Headphones}
          iconColor="text-emerald-600"
          bgColor="bg-emerald-500/10"
        />
      </motion.div>

      <motion.div
        className="px-4 lg:px-8 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {memoizedForm}

        <div className="space-y-4 mt-4">
          <AnimatePresence>
            {isLoading && (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center p-20"
              >
                <Loader />
                <p className="mt-4 text-sm text-emerald-600">Generating your music... This may take a minute.</p>
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded"
                role="alert"
              >
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <p className="font-bold">Error</p>
                </div>
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            {!music && !isLoading && !error && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Empty label="No Music Generated" />
              </motion.div>
            )}
          </AnimatePresence>

          {memoizedMusicPlayer}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MusicPage;