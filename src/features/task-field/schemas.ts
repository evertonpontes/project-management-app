import {
  AtIcon,
  CalendarDotsIcon,
  CaretCircleDownIcon,
  CheckSquareIcon,
  CurrencyDollarSimpleIcon,
  HashIcon,
  LinkIcon,
  PercentIcon,
  PhoneIcon,
  TextTIcon,
  UsersIcon,
} from "@phosphor-icons/react/ssr";
import z from "zod";

export const customTaskFieldKindsOptions = [
  { value: "Text", icon: TextTIcon },
  { value: "Date", icon: CalendarDotsIcon },
  { value: "People", icon: UsersIcon },
  { value: "Number", icon: HashIcon },
  { value: "Percent", icon: PercentIcon },
  { value: "Currency", icon: CurrencyDollarSimpleIcon },
  { value: "Checkbox", icon: CheckSquareIcon },
  { value: "Dropdown", icon: CaretCircleDownIcon },
  { value: "Email", icon: AtIcon },
  { value: "Phone", icon: PhoneIcon },
  { value: "URL", icon: LinkIcon },
];

export const customTaskFieldKinds = [
  "Text",
  "Date",
  "People",
  "Number",
  "Percent",
  "Currency",
  "Checkbox",
  "Dropdown",
  "Email",
  "Phone",
  "URL",
] as const;

type StringListType = typeof customTaskFieldKinds;

type Indices = keyof StringListType;

export type CustomTaskFieldKinds = StringListType[Indices];

const currencySettingsSchema = z
  .object({
    defaultCurrency: z.string().default("USD").optional(),
    displayFormat: z.string().default("ISOFormat").optional(), // IsoCodeAfter EuroSymbolAfterWithSpace EuroSymbolAfterNoSpace EuroSymbolBeforeWithSpace EuroSymbolBeforeNoSpace
    displayIntegerDecimalFormat: z.number().default(0).optional(),
  })
  .optional();

const dropdownSettingsSchema = z
  .object({
    allowMultiple: z.boolean().default(false).optional(),
    options: z.array(z.object({ id: z.string(), value: z.string() })),
    defaultValue: z.string().nullable().default(null).optional(),
  })
  .optional();

const numberSettingsSchema = z
  .object({
    displayIntegerDecimalPlacesFormat: z.number().default(0).optional(),
    displayFloatDecimalPlacesFormat: z.number().default(0).optional(),
  })
  .optional();

const peopleSettingsSchema = z
  .object({
    allowMultiple: z.boolean().default(false).optional(),
  })
  .optional();

const percentSettingsSchema = z
  .object({
    displayIntegerDecimalPlacesFormat: z.number().default(0).optional(),
    displayFloatDecimalPlacesFormat: z.number().default(0).optional(),
  })
  .optional();

const phoneSettingsSchema = z
  .object({
    defaultCountryCode: z.string().default("USA(+1)").optional(),
  })
  .optional();

const createCustomTaskFieldSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  visibility: z.enum(["HIDDEN", "VISIBLE"]),
  kind: z.string(),
  currencySettings: currencySettingsSchema,
  dropdownSettings: dropdownSettingsSchema,
  numberSettings: numberSettingsSchema,
  peopleSettings: peopleSettingsSchema,
  percentSettings: percentSettingsSchema,
  phoneSettings: phoneSettingsSchema,
});

const updateCustomTaskFieldSchema = z.object({
  name: z.string().trim().min(1, "Name is required").optional(),
  visibility: z.enum(["HIDDEN", "VISIBLE"]),
  currencySettings: currencySettingsSchema,
  dropdownSettings: dropdownSettingsSchema,
  numberSettings: numberSettingsSchema,
  peopleSettings: peopleSettingsSchema,
  percentSettings: percentSettingsSchema,
  phoneSettings: phoneSettingsSchema,
});

export {
  createCustomTaskFieldSchema,
  updateCustomTaskFieldSchema,
  currencySettingsSchema,
  dropdownSettingsSchema,
  numberSettingsSchema,
  peopleSettingsSchema,
  percentSettingsSchema,
  phoneSettingsSchema,
};
