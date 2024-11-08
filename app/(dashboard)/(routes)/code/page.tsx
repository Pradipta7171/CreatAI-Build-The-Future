"use client";

import * as z from "zod";
import { CodeXml } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { lazy, Suspense } from 'react';
import { useState, useMemo, useCallback } from "react";

import axios from "axios";
import Heading from "@/components/heading";
import { formSchema } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";

const LazyReactMarkdown = lazy(() => import('react-markdown'));

interface Message {
  role: "user" | "model";
  content: string;
}

const CodePage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  });

  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const userMessage: Message = {
        role: "user",
        content: values.prompt
      };

      setMessages(current => [...current, userMessage]);
      form.reset();

      const response = await axios.post("/api/code", {
        messages: [...messages, userMessage],
      });

      if (response.data.message) {
        setMessages(current => [...current, { role: "model", content: response.data.message }]);
      } else if (response.data.error) {
        console.error("API Error:", response.data.error);
        setMessages(current => [...current, { role: "model", content: "Sorry, I encountered an error: " + response.data.error }]);
      }

    } catch (error) {
      console.error("Error in chat submission:", error);
      setMessages(current => [...current, { role: "model", content: "Sorry, I encountered an error." }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, form]);

  const memoizedMessages = useMemo(() => messages, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-100"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Heading
          title="Code Assistant"
          description="Get help with your code with descriptive text, ask questions, and get answers."
          icon={CodeXml}
          iconColor="text-blue-600"
          bgColor="bg-blue-100"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="px-4 lg:px-8 mt-8"
      >
        <div>
          <Form {...form}>
            <motion.form
              onSubmit={form.handleSubmit(onSubmit)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="rounded-lg border w-full shadow-lg p-4 px-3 md:px-6 focus-within:shadow-xl grid grid-cols-12 gap-2 bg-white"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-2 focus-visible:ring-transparent rounded-lg text-gray-800 transition-all duration-300"
                        disabled={isLoading}
                        placeholder="Describe what you'd like to see (e.g. Simple toggle button using React hooks)"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-md"
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

            {memoizedMessages.length === 0 && !isLoading && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Empty label="No Coding started" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="flex flex-col gap-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence>
              {memoizedMessages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "p-6 w-full flex items-start gap-x-4 rounded-lg",
                    message.role === "user"
                      ? "bg-pink-50 border border-pink-200"
                      : "bg-blue-50 border border-blue-200"
                  )}
                >
                  {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                  <Suspense fallback={<div>Loading...</div>}>
                    <LazyReactMarkdown
                      components={{
                        pre: ({ node, ...props }) => (
                          <div className="overflow-auto w-full my-2 p-2 rounded-lg bg-black/10">
                            <pre {...props} />
                          </div>
                        ),
                        code: ({ node, ...props }) => (
                          <code className="bg-black/10 rounded-md p-1" {...props} />
                        ),
                      }}
                      className="text-sm overflow-hidden leading-7"
                    >
                      {message.content || "No message found."}
                    </LazyReactMarkdown>
                  </Suspense>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CodePage;