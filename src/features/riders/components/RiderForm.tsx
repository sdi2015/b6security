import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PostgrestError } from "@supabase/supabase-js";
import { isRlsError } from "../hooks";
import type { Rider, RiderInput } from "../types";

const riderSchema = z.object({
  full_name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name is required"),
  discipline: z
    .string()
    .trim()
    .max(120, "Discipline is too long")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .trim()
    .max(30, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

type RiderFormValues = z.infer<typeof riderSchema>;

type CreateRiderFormProps = {
  accountId: string | null;
  onCreated?: (rider: Rider) => void;
  disabled?: boolean;
};

type UpdateRiderFormProps = {
  accountId: string | null;
  rider: Rider;
  onUpdated?: (rider: Rider) => void;
  onDeactivated?: (rider: Rider) => void;
  readOnly?: boolean;
};

function normalize(values: RiderFormValues): RiderInput {
  return {
    full_name: values.full_name.trim(),
    discipline: values.discipline?.trim() ? values.discipline.trim() : null,
    email: values.email?.trim() ? values.email.trim() : null,
    phone: values.phone?.trim() ? values.phone.trim() : null,
    notes: values.notes?.trim() ? values.notes.trim() : null,
  };
}

function showErrorToast(
  toast: ReturnType<typeof useToast>["toast"],
  error: PostgrestError | Error
) {
  if (isRlsError(error)) {
    toast({
      title: "View-only access",
      description:
        "You have view-only access to riders. Ask an owner or manager to make changes.",
      variant: "destructive",
    });
    return;
  }

  toast({
    title: "Something went wrong",
    description:
      (error as PostgrestError)?.message ??
      (error instanceof Error ? error.message : "Failed to save rider"),
    variant: "destructive",
  });
}

export function CreateRiderForm({
  accountId,
  onCreated,
  disabled,
}: CreateRiderFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<RiderFormValues>({
    resolver: zodResolver(riderSchema),
    defaultValues: {
      full_name: "",
      discipline: "",
      phone: "",
      email: "",
      notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: RiderFormValues) => {
      if (!accountId) {
        throw new Error("No account selected");
      }

      const payload = normalize(values);
      const { data, error } = await supabase
        .from("riders")
        .insert({
          ...payload,
          account_id: accountId,
          is_active: true,
        })
        .select(
          "id,account_id,full_name,discipline,email,phone,is_active,notes,created_at"
        )
        .single();

      if (error) {
        throw error;
      }

      return data as Rider;
    },
    onSuccess: (rider) => {
      toast({
        title: "Rider created",
        description: `${rider.full_name} has been added`,
      });
      form.reset();
      void queryClient.invalidateQueries({ queryKey: ["riders", accountId] });
      onCreated?.(rider);
    },
    onError: (error) => {
      showErrorToast(toast, error as PostgrestError | Error);
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    if (!accountId) {
      toast({
        title: "Account loading",
        description: "Select an account before creating riders.",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate(values);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Full name</label>
          <Input
            placeholder="Jane Rider"
            {...form.register("full_name")}
            disabled={mutation.isPending || disabled}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Discipline</label>
          <Input
            placeholder="Dressage"
            {...form.register("discipline")}
            disabled={mutation.isPending || disabled}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Phone</label>
          <Input
            placeholder="(555) 555-5555"
            {...form.register("phone")}
            disabled={mutation.isPending || disabled}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Email</label>
          <Input
            placeholder="rider@example.com"
            {...form.register("email")}
            disabled={mutation.isPending || disabled}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Notes</label>
        <Textarea
          placeholder="Training notes, preferences, etc."
          rows={4}
          {...form.register("notes")}
          disabled={mutation.isPending || disabled}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={mutation.isPending || disabled}>
          {mutation.isPending ? "Saving..." : "Add rider"}
        </Button>
      </div>
    </form>
  );
}

export function UpdateRiderForm({
  accountId,
  rider,
  onUpdated,
  onDeactivated,
  readOnly,
}: UpdateRiderFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const defaultValues = useMemo<RiderFormValues>(
    () => ({
      full_name: rider.full_name ?? "",
      discipline: rider.discipline ?? "",
      phone: rider.phone ?? "",
      email: rider.email ?? "",
      notes: rider.notes ?? "",
    }),
    [rider]
  );

  const form = useForm<RiderFormValues>({
    resolver: zodResolver(riderSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const updateMutation = useMutation({
    mutationFn: async (values: RiderFormValues) => {
      if (!accountId) {
        throw new Error("No account selected");
      }
      const payload = normalize(values);
      const { data, error } = await supabase
        .from("riders")
        .update(payload)
        .eq("account_id", accountId)
        .eq("id", rider.id)
        .select(
          "id,account_id,full_name,discipline,email,phone,is_active,notes,created_at"
        )
        .single();
      if (error) {
        throw error;
      }
      return data as Rider;
    },
    onSuccess: (updated) => {
      toast({
        title: "Rider updated",
        description: `${updated.full_name} has been updated`,
      });
      void queryClient.invalidateQueries({ queryKey: ["riders", accountId] });
      void queryClient.invalidateQueries({ queryKey: ["rider", accountId, rider.id] });
      onUpdated?.(updated);
    },
    onError: (error) => {
      showErrorToast(toast, error as PostgrestError | Error);
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: async () => {
      if (!accountId) {
        throw new Error("No account selected");
      }
      const { data, error } = await supabase
        .from("riders")
        .update({ is_active: false })
        .eq("account_id", accountId)
        .eq("id", rider.id)
        .select(
          "id,account_id,full_name,discipline,email,phone,is_active,notes,created_at"
        )
        .single();
      if (error) {
        throw error;
      }
      return data as Rider;
    },
    onSuccess: (updated) => {
      toast({
        title: "Rider deactivated",
        description: `${updated.full_name} is now inactive`,
      });
      void queryClient.invalidateQueries({ queryKey: ["riders", accountId] });
      void queryClient.invalidateQueries({ queryKey: ["rider", accountId, rider.id] });
      onDeactivated?.(updated);
    },
    onError: (error) => {
      showErrorToast(toast, error as PostgrestError | Error);
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    if (readOnly) {
      toast({
        title: "View-only access",
        description: "You do not have permission to edit this rider.",
        variant: "destructive",
      });
      return;
    }
    updateMutation.mutate(values);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Full name</label>
          <Input
            {...form.register("full_name")}
            disabled={updateMutation.isPending || readOnly}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Discipline</label>
          <Input
            {...form.register("discipline")}
            disabled={updateMutation.isPending || readOnly}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Phone</label>
          <Input
            {...form.register("phone")}
            disabled={updateMutation.isPending || readOnly}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Email</label>
          <Input
            {...form.register("email")}
            disabled={updateMutation.isPending || readOnly}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Notes</label>
        <Textarea
          rows={4}
          {...form.register("notes")}
          disabled={updateMutation.isPending || readOnly}
        />
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          Status: {rider.is_active ? "Active" : "Inactive"}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={
              deactivateMutation.isPending ||
              updateMutation.isPending ||
              readOnly ||
              !rider.is_active
            }
            onClick={() => deactivateMutation.mutate()}
          >
            {deactivateMutation.isPending ? "Working..." : "Deactivate"}
          </Button>
          <Button type="submit" disabled={updateMutation.isPending || readOnly}>
            {updateMutation.isPending ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
