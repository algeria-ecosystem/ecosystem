import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Rocket,
  Layers,
  MapPin,
  Database,
  Radio,
  ArrowRight
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Entities", value: "Manage", icon: Rocket, path: "/admin/entities", color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Categories", value: "Manage", icon: Layers, path: "/admin/categories", color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Wilayas", value: "Manage", icon: MapPin, path: "/admin/wilayas", color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Entity Types", value: "Manage", icon: Database, path: "/admin/entity-types", color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Media Types", value: "Manage", icon: Radio, path: "/admin/media-types", color: "text-pink-500", bg: "bg-pink-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Manage your ecosystem database resources.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <Card
            key={item.label}
            className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50 group"
            onClick={() => navigate(item.path)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.label}
              </CardTitle>
              <div className={`p-2 rounded-lg ${item.bg}`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-muted-foreground group-hover:text-primary transition-colors mt-2">
                <span>View & Edit</span>
                <ArrowRight className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
