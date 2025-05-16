"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const FormSchema = z.object({
  dob: z.date({
    required_error: "A date is required.",
  }),
});

interface CalendarFormProps {
  onDateChange?: (date: string) => void;
  label?: string;
  disabled?: boolean;
}

export function CalendarForm({
  onDateChange,
  label,
  disabled = false,
}: CalendarFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const handleDateSelect = (date: Date | undefined) => {
    if (date && onDateChange) {
      form.setValue("dob", date, { shouldValidate: true });
      const formattedDate = format(date, "yyyy-MM-dd");
      onDateChange(formattedDate);
    }
  };

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="dob"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="!text-left text-white">
              {!label ? "Date of Birth" : label}
            </FormLabel>
            <Popover>
              <PopoverTrigger disabled={disabled} asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal bg-gray-700 text-white border-gray-500 hover:bg-gray-900 hover:text-white",
                      !field.value && "text-gray-400"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>{!label ? "Date of Birth" : label}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    field.onChange(date);
                    handleDateSelect(date);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
}
