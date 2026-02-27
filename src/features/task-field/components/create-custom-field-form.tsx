"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
  FieldSet,
  FieldLegend,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  createCustomTaskFieldSchema,
  customTaskFieldKindsOptions,
} from "../schemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CaretDownIcon,
  CheckIcon,
  PlusIcon,
  XIcon,
} from "@phosphor-icons/react";

import { UseFormReturn } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Currency, CurrencySelect } from "@/components/currency-select";
import { currencies } from "country-data-list";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneSelect } from "@/components/phone-select";

interface CreateCustomFieldFormProps {
  onCancel: () => void;
  form: UseFormReturn<z.infer<typeof createCustomTaskFieldSchema>>;
  step: number;
  setStep: (step: number) => void;
}

const CreateCustomFieldForm = ({
  onCancel,
  form,
  step,
  setStep,
}: CreateCustomFieldFormProps) => {
  const contentRef = useRef<HTMLButtonElement>(null);

  const kind = form.watch("kind");

  console.log(form.formState.errors);

  const onSubmit = (values: z.infer<typeof createCustomTaskFieldSchema>) => {
    console.log(values);
  };

  const onNextStep = () => {
    if (step < 1) {
      setStep(step + 1);
    }
  };

  const onBackStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  useEffect(() => {
    if (step === 1) {
      if (contentRef.current) {
        contentRef.current.focus();
      }
    }
  }, [step]);

  const KindFieldSettings = () => {
    switch (kind) {
      case "Currency":
        return <CurrencySettingsForm form={form} />;
      case "Dropdown":
        return <DropdownSettingsForm form={form} />;
      case "Number":
        return <NumberSettingsForm form={form} />;
      case "People":
        return <PeopleSettingsForm form={form} />;
      case "Percent":
        return <PercentSettingsForm form={form} />;
      case "Phone":
        return <PhoneSettingsForm form={form} />;
      default:
        return null;
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FieldSet className={cn(step !== 0 && "hidden")}>
          <FieldLegend>Create custom field</FieldLegend>
          <FieldGroup>
            <div className="max-h-[500px] w-full overflow-y-auto flex flex-col gap-4 border-b border-muted-foreground/10 py-4 px-4">
              {customTaskFieldKindsOptions.map((kind) => (
                <React.Fragment key={kind.value}>
                  <Controller
                    name="kind"
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <Button
                          variant="ghost"
                          type="button"
                          className={cn(
                            "justify-start",
                            field.value === kind.value &&
                              "bg-primary/10 border border-primary text-primary",
                          )}
                          onClick={() => {
                            field.onChange(kind.value);
                            onNextStep();
                          }}
                        >
                          <kind.icon />
                          {kind.value}
                        </Button>
                      </Field>
                    )}
                  />
                </React.Fragment>
              ))}
            </div>

            <Field orientation="horizontal" className="justify-end">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="button" onClick={onNextStep} disabled={!kind}>
                Continue
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet className={cn(step !== 1 && "hidden")}>
          <FieldLegend className="mb-8">Create custom field</FieldLegend>
          <FieldGroup className="w-full lg:max-w-md mx-auto py-0 px-2">
            <div className="h-[500px] w-full overflow-y-auto flex flex-col gap-4 py-4 px-4">
              <Controller
                name="kind"
                control={form.control}
                render={({ field }) => (
                  <div className="relative">
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      modal={false}
                    >
                      <SelectTrigger className="w-full" ref={contentRef}>
                        <SelectValue placeholder="Enter field type" />
                      </SelectTrigger>
                      <SelectContent alignItemWithTrigger={false}>
                        <SelectGroup>
                          {customTaskFieldKindsOptions.map((kind) => (
                            <SelectItem key={kind.value} value={kind.value}>
                              <kind.icon />
                              {kind.value}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />

              <Controller
                name="name"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      id="name"
                      placeholder="Enter field name"
                      {...field}
                    />
                  </Field>
                )}
              />

              <KindFieldSettings />
            </div>
            <Field orientation="horizontal" className="justify-end">
              <Button type="button" variant="outline" onClick={onBackStep}>
                Back
              </Button>
              <Button type="submit">Create Custom Field</Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </FieldGroup>
    </form>
  );
};

export { CreateCustomFieldForm };

interface AdditionalSettingsFormProps {
  form: UseFormReturn<z.infer<typeof createCustomTaskFieldSchema>>;
}

const CurrencySettingsForm = ({ form }: AdditionalSettingsFormProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>({
    code: "USD",
    decimals: 2,
    name: "United States dollar",
    number: "840",
    symbol: "$",
  });

  const handleSelectedCurrency = (currency: Currency) => {
    setSelectedCurrency(currency);
  };

  const currencyDisplayFormats = useMemo(() => {
    return [
      {
        label: `${selectedCurrency?.symbol}40`,
        value: "SymbolBeforeWithoutSpace",
      },
      {
        label: `${selectedCurrency?.symbol} 40`,
        value: "SymbolBeforeWithpace",
      },
      {
        label: `40${selectedCurrency?.symbol}`,
        value: "SymbolAfterWithoutSpace",
      },
      {
        label: `40 ${selectedCurrency?.symbol}`,
        value: "SymbolAfterWithSpace",
      },
      { label: `40 ${selectedCurrency?.code}`, value: "ISOFormat" },
    ];
  }, [selectedCurrency]);

  const displayIntegerPlaces = [
    { label: "Without decimal places", value: 0 },
    { label: "With 2 decimal places", value: 2 },
  ];

  return (
    <FieldGroup>
      <Controller
        name="currencySettings.defaultCurrency"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor="defaultCurrency">Default Currency</FieldLabel>
            <CurrencySelect
              onValueChange={field.onChange}
              onCurrencySelect={handleSelectedCurrency}
              currencies="all"
              {...field}
              value={field.value ?? "USD"}
            />
          </Field>
        )}
      />

      <Controller
        name="currencySettings.displayFormat"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor="displayFormat">Display Format</FieldLabel>
            <Select
              items={currencyDisplayFormats}
              id="displayFormat"
              defaultValue="ISOFormat"
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {currencyDisplayFormats.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}
      />

      <Controller
        name="currencySettings.displayIntegerDecimalFormat"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor="displayIntegerDecimalFormat">
              How to display integers
            </FieldLabel>
            <Select
              items={displayIntegerPlaces}
              id="displayIntegerDecimalFormat"
              defaultValue={0}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {displayIntegerPlaces.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}
      />
    </FieldGroup>
  );
};

const DropdownSettingsForm = ({ form }: AdditionalSettingsFormProps) => {
  const { fields, append, remove, update } = useFieldArray({
    name: "dropdownSettings.options",
    control: form.control,
  });

  return (
    <FieldGroup>
      <FieldLabel>Options</FieldLabel>
      {fields.map((option, index) => (
        <Controller
          key={option.id}
          name={`dropdownSettings.options.${index}.value`}
          control={form.control}
          render={({ field }) => (
            <Field orientation="horizontal">
              <Input
                placeholder="Option value"
                {...field}
                onBlur={(e) => {
                  field.onBlur();
                  update(index, { ...option, value: e.target.value });
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
              >
                <XIcon />
              </Button>
            </Field>
          )}
        />
      ))}

      <Field>
        <Button
          type="button"
          variant="ghost"
          onClick={() => append({ id: crypto.randomUUID(), value: "" })}
          className="w-full lg:w-fit text-muted-foreground"
        >
          <PlusIcon />
          Add Option
        </Button>
      </Field>

      <FieldSeparator />

      <Controller
        name="dropdownSettings.allowMultiple"
        control={form.control}
        render={({ field }) => (
          <Field orientation="horizontal">
            <Checkbox
              id="allowMultiple"
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
            />
            <FieldLabel htmlFor="allowMultiple">
              Allow to select multiple options
            </FieldLabel>
          </Field>
        )}
      />

      <Controller
        name="dropdownSettings.defaultValue"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor="defaultValue">Default option</FieldLabel>
            <Select
              items={[
                { label: "None", value: null },
                ...fields.map((option) => ({
                  label: option.value,
                  value: option.id,
                })),
              ]}
              id="defaultValue"
              defaultValue={"None"}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={null} className="text-muted-foreground">
                    None
                  </SelectItem>
                  {fields.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.value}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}
      />
    </FieldGroup>
  );
};

const NumberSettingsForm = ({ form }: AdditionalSettingsFormProps) => {
  const floatDecimalPlaces = form.watch(
    "numberSettings.displayFloatDecimalPlacesFormat",
  );

  const displayIntegerPlaces = useMemo(() => {
    const defaultValue = [{ label: "Without decimal places", value: 0 }];

    if (floatDecimalPlaces) {
      defaultValue.push({
        label: "With decimal places",
        value: floatDecimalPlaces,
      });
    }

    return defaultValue;
  }, [floatDecimalPlaces]);

  const displayFloatPlaces = [
    { label: "Without decimal places", value: 0 },
    { label: "With 1 decimal places", value: 1 },
    { label: "With 2 decimal places", value: 2 },
    { label: "With 3 decimal places", value: 3 },
    { label: "With 4 decimal places", value: 4 },
    { label: "With 5 decimal places", value: 5 },
    { label: "With 6 decimal places", value: 6 },
    { label: "With 7 decimal places", value: 7 },
    { label: "With 8 decimal places", value: 8 },
    { label: "With 9 decimal places", value: 9 },
    { label: "With 10 decimal places", value: 10 },
  ];

  return (
    <FieldGroup>
      <Controller
        name="numberSettings.displayIntegerDecimalPlacesFormat"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor="displayIntegerDecimalFormat">
              How to display integers
            </FieldLabel>
            <Select
              items={displayIntegerPlaces}
              id="displayIntegerDecimalFormat"
              defaultValue={0}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {displayIntegerPlaces.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}
      />

      <Controller
        name="numberSettings.displayFloatDecimalPlacesFormat"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor="displayFloatDecimalPlacesFormat">
              How to display non-integers
            </FieldLabel>
            <Select
              items={displayFloatPlaces}
              id="displayFloatDecimalPlacesFormat"
              defaultValue={0}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {displayFloatPlaces.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}
      />
    </FieldGroup>
  );
};

const PeopleSettingsForm = ({ form }: AdditionalSettingsFormProps) => {
  return (
    <FieldGroup>
      <Controller
        name="peopleSettings.allowMultiple"
        control={form.control}
        render={({ field }) => (
          <Field orientation="horizontal">
            <Checkbox
              id="allowMultiple"
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
            />
            <FieldLabel htmlFor="allowMultiple">
              Allow to select multiple people
            </FieldLabel>
          </Field>
        )}
      />
    </FieldGroup>
  );
};

const PercentSettingsForm = ({ form }: AdditionalSettingsFormProps) => {
  const floatDecimalPlaces = form.watch(
    "percentSettings.displayFloatDecimalPlacesFormat",
  );

  const displayIntegerPlaces = useMemo(() => {
    const defaultValue = [{ label: "Without decimal places", value: 0 }];

    if (floatDecimalPlaces) {
      defaultValue.push({
        label: "With decimal places",
        value: floatDecimalPlaces,
      });
    }

    return defaultValue;
  }, [floatDecimalPlaces]);

  const displayFloatPlaces = [
    { label: "Without decimal places", value: 0 },
    { label: "With 1 decimal places", value: 1 },
    { label: "With 2 decimal places", value: 2 },
    { label: "With 3 decimal places", value: 3 },
    { label: "With 4 decimal places", value: 4 },
    { label: "With 5 decimal places", value: 5 },
    { label: "With 6 decimal places", value: 6 },
    { label: "With 7 decimal places", value: 7 },
    { label: "With 8 decimal places", value: 8 },
    { label: "With 9 decimal places", value: 9 },
    { label: "With 10 decimal places", value: 10 },
  ];

  return (
    <FieldGroup>
      <Controller
        name="percentSettings.displayIntegerDecimalPlacesFormat"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor="displayIntegerDecimalFormat">
              How to display integers
            </FieldLabel>
            <Select
              items={displayIntegerPlaces}
              id="displayIntegerDecimalFormat"
              defaultValue={0}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {displayIntegerPlaces.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}
      />

      <Controller
        name="percentSettings.displayFloatDecimalPlacesFormat"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor="displayFloatDecimalPlacesFormat">
              How to display non-integers
            </FieldLabel>
            <Select
              items={displayFloatPlaces}
              id="displayFloatDecimalPlacesFormat"
              defaultValue={0}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {displayFloatPlaces.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}
      />
    </FieldGroup>
  );
};

const PhoneSettingsForm = ({ form }: AdditionalSettingsFormProps) => {
  return (
    <FieldGroup>
      <Controller
        name="phoneSettings.defaultCountryCode"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor="defaultCountryCode">
              Default country code
            </FieldLabel>
            <PhoneSelect
              id="defaultCountryCode"
              onValueChange={field.onChange}
              {...field}
              value={field.value ?? "USA(+1)"}
            />
          </Field>
        )}
      />
    </FieldGroup>
  );
};
