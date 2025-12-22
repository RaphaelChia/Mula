'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';

interface FormValues {
  options: { value: string }[];
}

const FormPollCreateOptions = () => {
  const { register, control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      options: [{ value: '' }, { value: '' }], // Start with 2 empty options
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const onSubmit = (data: FormValues) => {
    console.log('Form data:', data);
    // Handle form submission here
  };

  return (
    <form
      id="poll-options-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="mb-4 flex items-center justify-between">
        <label className="text-sm font-medium">Poll Options</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ value: '' })}
          className="gap-1.5"
        >
          <Plus className="size-4" />
          Add Option
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input
              {...register(`options.${index}.value` as const, {
                required: 'Option cannot be empty',
              })}
              placeholder={`Option ${index + 1}`}
              className="flex-1"
            />
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="shrink-0"
                aria-label={`Remove option ${index + 1}`}
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </form>
  );
};

export default FormPollCreateOptions;
