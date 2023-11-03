"use client";

import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "./ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import useModalStore from "@/store/modal-store";
import useBoardStore from "@/store/board-store";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(2).max(50),
  status: z.string().min(2).max(50),
  image: z.string(),
});

const CreateTodoForm = () => {
  const { toast } = useToast();

  const [createTodo, uploadImage, imageUrl, clearImageUrl] = useBoardStore(
    (state) => [
      state.createTodo,
      state.uploadImage,
      state.imageUrl,
      state.clearImageUrl,
    ]
  );
  const modalStore = useModalStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      status: modalStore.column,
      image: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    values.image = imageUrl;
    createTodo(values);
    clearImageUrl();
    modalStore.onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Go to the gym" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <div
                    className={cn(
                      "flex items-center justify-between space-x-2  p-4 rounded-md shadow-md",
                      field.value === "todo" && " bg-red-500/50 text-white"
                    )}
                  >
                    <Label
                      htmlFor="todo"
                      className="flex flex-1 flex-col justify-center h-16"
                    >
                      Todo{" "}
                      <span className="mt-2">A new task to be completed</span>
                    </Label>
                    <RadioGroupItem value="todo" id="todo" />
                  </div>
                  <div
                    className={cn(
                      "flex items-center justify-between space-x-2  p-4 rounded-md shadow-md",
                      field.value === "inprogress" &&
                        " bg-yellow-500/50 text-white"
                    )}
                  >
                    <Label
                      htmlFor="inprogress"
                      className="flex flex-1 flex-col justify-center h-16"
                    >
                      In Progress{" "}
                      <span className="mt-2">
                        A task you are currently working on
                      </span>
                    </Label>
                    <RadioGroupItem value="inprogress" id="inprogress" />
                  </div>
                  <div
                    className={cn(
                      "flex items-center justify-between space-x-2  p-4 rounded-md shadow-md",
                      field.value === "done" && " bg-green-500/50 text-white"
                    )}
                  >
                    <Label
                      htmlFor="done"
                      className="flex flex-1 flex-col justify-center h-16"
                    >
                      Done{" "}
                      <span className="mt-2">
                        A task you have already completed
                      </span>
                    </Label>
                    <RadioGroupItem value="done" id="done" />
                  </div>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex w-full items-center justify-center shadow-md h-32">
                  <Label htmlFor="picture">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        height={64}
                        width={64}
                        alt="image"
                        className="w-24 h-24 object-contain"
                      />
                    ) : (
                      <PhotoIcon className="w-16 h-16 text-gray-400" />
                    )}
                  </Label>
                  <Input
                    {...field}
                    type="file"
                    id="picture"
                    className="hidden"
                    value={field.value}
                    onChange={(e) => {
                      if (!e.target.files![0].type.startsWith("image/"))
                        return toast({
                          title: "You can upload only image file!",
                          variant: "destructive",
                        });
                      uploadImage(e.target.files![0]);
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={!isValid || isSubmitting}>
          Save
        </Button>
      </form>
    </Form>
  );
};

export default CreateTodoForm;
