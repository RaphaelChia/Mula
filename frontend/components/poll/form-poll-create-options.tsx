'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreatePollNew } from '@/hooks/poll/useCreatePoll';
import { useKeyBind } from '@/hooks/use-key-bind';
import { usePolls } from '@/lib/atoms/poll';
import { PACKAGE_CONFIG } from '@/lib/package-config';
import { cn } from '@/lib/utils';
import { Plus, X } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface FormValues {
  options: { value: string }[];
  title: string;
}

interface CreateOptionsProps {
  onSuccess?: () => void;
  onFailure?: () => void;
}

const FormPollCreateOptions = ({
  onSuccess,
  onFailure,
}: CreateOptionsProps) => {
  const { setPolls } = usePolls();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      options: [{ value: '' }, { value: '' }], // Start with 2 empty options
    },
  });
  const { mutateAsync } = useCreatePollNew();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  // Refs to track input elements
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const onSubmit = useCallback(
    (data: FormValues) => {
      mutateAsync({
        name: data.title,
        options: data.options.map((option) => option.value),
        packageAddress: PACKAGE_CONFIG.testnet.pollPackage,
      })
        .then((result) => {
          setTimeout(() => {
            const objectId = result.objectId;
            if (objectId) {
              setPolls((prev) => [...prev, objectId]);
            }
          }, 1000);
          toast.success('Poll created successfully');
          onSuccess?.();
          console.log('Transaction result:', result);
        })
        .catch((error) => {
          toast.error('Failed to create poll');
          console.error('Transaction error:', error);
          onFailure?.();
        });
    },
    [mutateAsync],
  );

  // Handle Enter key: create new input and focus it
  useKeyBind({
    key: 'Enter',
    ignoreInputFocus: false, // We want this to work when input is focused
    onPress: (event) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' &&
        target.getAttribute('data-slot') === 'input'
      ) {
        event.preventDefault();
        const currentIndex = inputRefs.current.findIndex(
          (ref) => ref === target,
        );
        if (currentIndex !== -1) {
          const newIndex = currentIndex + 1;
          append({ value: '' });
          // Focus the new input after it's rendered
          setTimeout(() => {
            const newInput = inputRefs.current[newIndex];
            if (newInput) {
              newInput.focus();
            }
          }, 0);
        }
      }
    },
  });

  // Handle Backspace key: delete empty input
  useKeyBind({
    key: 'Backspace',
    ignoreInputFocus: false, // We want this to work when input is focused
    onPress: (event) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' &&
        target.getAttribute('data-slot') === 'input'
      ) {
        const input = target as HTMLInputElement;
        const currentIndex = inputRefs.current.findIndex(
          (ref) => ref === input,
        );

        // Only delete if input is empty and there's more than one option
        if (currentIndex !== -1 && input.value === '' && fields.length > 1) {
          event.preventDefault();
          const previousIndex = currentIndex - 1;
          remove(currentIndex);

          // Focus the previous input (or next if it was the first)
          setTimeout(() => {
            const focusIndex =
              previousIndex >= 0
                ? previousIndex
                : Math.min(0, fields.length - 2);
            const inputToFocus = inputRefs.current[focusIndex];
            if (inputToFocus) {
              inputToFocus.focus();
            }
          }, 0);
        }
      }
    },
  });

  // Update refs array when fields change
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, fields.length);
  }, [fields.length]);

  return (
    <form
      id="poll-options-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-sm font-medium">
          Poll Title
        </label>
        <Input
          maxLength={50}
          {...register('title')}
          placeholder="e.g. What is your favorite color?"
          className="w-full"
        />
      </div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium">Poll Options</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ value: '' })}
          className="gap-1.5"
        >
          <Plus className="size-4" />
          Option
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => {
          const { ref, ...registerProps } = register(
            `options.${index}.value` as const,
            {
              required: 'Option cannot be empty',
              maxLength: 50,
            },
          );

          return (
            <div key={field.id} className="flex items-center gap-2">
              <Input
                maxLength={50}
                {...registerProps}
                ref={(el) => {
                  inputRefs.current[index] = el;
                  if (typeof ref === 'function') {
                    ref(el);
                  }
                }}
                placeholder={`Option ${index + 1}`}
                className={cn(
                  'flex-1',
                  errors.options?.[index]?.value && 'border-destructive',
                )}
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
          );
        })}
      </div>
    </form>
  );
};

export default FormPollCreateOptions;
