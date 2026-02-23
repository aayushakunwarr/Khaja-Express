import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../lib/api";
import { useAuth } from "../app/AuthProvider";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  password: z.string().min(6)
});

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema)
  });

  const mutation = useMutation({
    mutationFn: async (values) => (await api.post("/api/auth/register", values)).data.data,
    onSuccess: (data) => {
      login(data);
      toast.success("Account created");
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  });

  const onSubmit = (values) => mutation.mutate(values);

  return (
    <section className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-3xl bg-white p-8 shadow-card">
        <h2 className="font-display text-2xl text-ink">Create Account</h2>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("name")}
            placeholder="Full name"
            className="w-full rounded-2xl border border-orange-100 px-4 py-3 text-sm"
          />
          {formState.errors.name && (
            <p className="text-xs text-red-500">{formState.errors.name.message}</p>
          )}
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full rounded-2xl border border-orange-100 px-4 py-3 text-sm"
          />
          {formState.errors.email && (
            <p className="text-xs text-red-500">{formState.errors.email.message}</p>
          )}
          <input
            {...register("phone")}
            placeholder="Phone"
            className="w-full rounded-2xl border border-orange-100 px-4 py-3 text-sm"
          />
          {formState.errors.phone && (
            <p className="text-xs text-red-500">{formState.errors.phone.message}</p>
          )}
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="w-full rounded-2xl border border-orange-100 px-4 py-3 text-sm"
          />
          {formState.errors.password && (
            <p className="text-xs text-red-500">{formState.errors.password.message}</p>
          )}
          <button
            type="submit"
            className="w-full rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-xs text-gray-500">
          Already have an account? <Link to="/login" className="text-primary-600">Login</Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
