// src/services/medications.ts
import { supabase } from "@/integrations/supabase/client";

export interface Medication {
  id?: string;
  name: string;
  dosage: string;
  frequency: string; // e.g. "Once daily", "Twice daily"
  time_of_day: string; // "08:00", "18:00"
  status?: string;
}

export const addMedication = async (medication: Medication) => {
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    throw new Error("User not logged in");
  }

  const { data, error } = await supabase
    .from("medications")
    .insert([
      {
        user_id: user.data.user.id,
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
        time_of_day: medication.time_of_day,
        status: "active",
      },
    ])
    .select();

  if (error) throw error;
  return data;
};

export const getMedications = async () => {
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    throw new Error("User not logged in");
  }

  const { data, error } = await supabase
    .from("medications")
    .select("*")
    .eq("user_id", user.data.user.id)
    .order("time_of_day", { ascending: true });

  if (error) throw error;
  return data;
};

export const markMedicationAsTaken = async (medicationId: string) => {
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    throw new Error("User not logged in");
  }

  const { error } = await supabase
    .from("medication_logs")
    .insert([
      {
        medication_id: medicationId,
        user_id: user.data.user.id,
        action: "taken",
      },
    ]);

  if (error) throw error;
};
