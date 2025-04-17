import {
  Briefcase,
  Users,
  Zap,
  Eye,
  SmileIcon as Tooth,
  Heart,
  Umbrella,
  Clock,
  Calendar,
  Building,
  GraduationCap,
  Dumbbell,
  Brain,
  Home,
  Bitcoin,
  UserCircle,
  PieChart,
  Coins,
  MonitorOff,
  Shield,
  UserPlus,
} from "lucide-react";
import React from "react";

interface Benefit {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const benefits: Benefit[] = [
  {
    id: "401k",
    label: "401(k)",
    icon: React.createElement(Briefcase, { className: "w-3 h-3" }),
  },
  {
    id: "distributed",
    label: "Distributed team",
    icon: React.createElement(Users, { className: "w-3 h-3" }),
  },
  {
    id: "async",
    label: "Async",
    icon: React.createElement(Zap, { className: "w-3 h-3" }),
  },
  {
    id: "vision",
    label: "Vision insurance",
    icon: React.createElement(Eye, { className: "w-3 h-3" }),
  },
  {
    id: "dental",
    label: "Dental insurance",
    icon: React.createElement(Tooth, { className: "w-3 h-3" }),
  },
  {
    id: "medical",
    label: "Medical insurance",
    icon: React.createElement(Heart, { className: "w-3 h-3" }),
  },
  {
    id: "unlimited_vacation",
    label: "Unlimited vacation",
    icon: React.createElement(Umbrella, { className: "w-3 h-3" }),
  },
  {
    id: "pto",
    label: "Paid time off",
    icon: React.createElement(Clock, { className: "w-3 h-3" }),
  },
  {
    id: "four_day",
    label: "4 day workweek",
    icon: React.createElement(Calendar, { className: "w-3 h-3" }),
  },
  {
    id: "401k_matching",
    label: "401k matching",
    icon: React.createElement(Coins, { className: "w-3 h-3" }),
  },
  {
    id: "company_retreats",
    label: "Company retreats",
    icon: React.createElement(Building, { className: "w-3 h-3" }),
  },
  {
    id: "coworking_budget",
    label: "Coworking budget",
    icon: React.createElement(Building, { className: "w-3 h-3" }),
  },
  {
    id: "learning_budget",
    label: "Learning budget",
    icon: React.createElement(GraduationCap, { className: "w-3 h-3" }),
  },
  {
    id: "gym",
    label: "Free gym membership",
    icon: React.createElement(Dumbbell, { className: "w-3 h-3" }),
  },
  {
    id: "mental_wellness",
    label: "Mental wellness budget",
    icon: React.createElement(Brain, { className: "w-3 h-3" }),
  },
  {
    id: "home_office",
    label: "Home office budget",
    icon: React.createElement(Home, { className: "w-3 h-3" }),
  },
  {
    id: "crypto",
    label: "Pay in crypto",
    icon: React.createElement(Bitcoin, { className: "w-3 h-3" }),
  },
  {
    id: "pseudonymous",
    label: "Pseudonymous",
    icon: React.createElement(UserCircle, { className: "w-3 h-3" }),
  },
  {
    id: "profit_sharing",
    label: "Profit sharing",
    icon: React.createElement(PieChart, { className: "w-3 h-3" }),
  },
  {
    id: "equity",
    label: "Equity compensation",
    icon: React.createElement(Coins, { className: "w-3 h-3" }),
  },
  {
    id: "no_whiteboard",
    label: "No whiteboard interview",
    icon: React.createElement(MonitorOff, { className: "w-3 h-3" }),
  },
  {
    id: "no_monitoring",
    label: "No monitoring system",
    icon: React.createElement(Shield, { className: "w-3 h-3" }),
  },
  {
    id: "hire_old_young",
    label: "We hire old (and young)",
    icon: React.createElement(UserPlus, { className: "w-3 h-3" }),
  },
];
