import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/atoms/card";
import { Badge } from "@/shared/components/atoms/badge";
import { Clock, User } from "lucide-react";

interface StickyNote {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  color: string;
  priority?: "high" | "normal";
}

