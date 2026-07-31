import React from "react";
import { Text, type TextStyle } from "react-native";

interface IconProps {
  size?: number;
  color?: string;
}

const base = (size = 24, color = "currentColor"): TextStyle => ({
  fontSize: size,
  color,
  textAlign: "center" as const,
  lineHeight: size * 1.2,
  includeFontPadding: false,
  textAlignVertical: "center" as const,
});

export function HomeIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>⌂</Text>;
}
export function BriefcaseIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>💼</Text>;
}
export function CalendarIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>▤</Text>;
}
export function UserIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>☻</Text>;
}
export function SearchIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>⌕</Text>;
}
export function BellIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>🔔</Text>;
}
export function ChevronRightIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>›</Text>;
}
export function ChevronLeftIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>‹</Text>;
}
export function ChevronDownIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>⌄</Text>;
}
export function PlusIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>＋</Text>;
}
export function CheckIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>✓</Text>;
}
export function CheckCircleIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>✓</Text>;
}
export function StarIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>★</Text>;
}
export function MapPinIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>📍</Text>;
}
export function LogOutIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>⏻</Text>;
}
export function SunIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>☀️</Text>;
}
export function MoonIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>🌙</Text>;
}
export function ChatIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>💬</Text>;
}
export function HeartIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>♡</Text>;
}
export function HeartFilledIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>♥</Text>;
}
export function SettingsIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>⚙️</Text>;
}
export function DollarIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>A$</Text>;
}
export function PlaneIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>✈️</Text>;
}
export function CarIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>🚗</Text>;
}
export function CalculatorIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>🧮</Text>;
}
export function AwardIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>🏅</Text>;
}
export function PackageIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>📦</Text>;
}
export function BarChartIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>📊</Text>;
}
export function UsersIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>👥</Text>;
}
export function StoreIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>🏪</Text>;
}
export function ShieldIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>🛡️</Text>;
}
export function ListIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>☰</Text>;
}
export function ClipboardIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>📋</Text>;
}
export function FileTextIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>📄</Text>;
}
export function SendIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>➤</Text>;
}
export function XIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>✕</Text>;
}
export function MenuIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>☰</Text>;
}
export function ClockIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>🕐</Text>;
}
export function PhoneIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>📞</Text>;
}
export function LockIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>🔒</Text>;
}
export function MailIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>✉️</Text>;
}
export function FilterIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>▦</Text>;
}
export function CreditCardIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>💳</Text>;
}
export function TrashIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>🗑️</Text>;
}
export function EditIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>✏️</Text>;
}
export function EyeIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>👁️</Text>;
}
export function TrendingUpIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>📈</Text>;
}
export function TrendingDownIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>📉</Text>;
}
export function ArrowRightIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>→</Text>;
}
export function ArrowLeftIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>←</Text>;
}
export function MoreIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>⋯</Text>;
}
export function InfoIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>ⓘ</Text>;
}
export function AlertIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>⚠</Text>;
}
export function SparkleIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>✦</Text>;
}
export function RefreshIcon({ size, color }: IconProps) {
  return <Text style={base(size, color)}>↻</Text>;
}
