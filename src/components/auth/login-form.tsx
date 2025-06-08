import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Logo from "../brand/logo";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { useAuth } from "@/context/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader } from "../ui/loader";
import { ErrorMessage } from "@hookform/error-message";

const formSchema = z.object({
  root: z.any(),
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Please must me alteast 8 characters",
  }),
});

type SignInSchema = z.infer<typeof formSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const auth = useAuth();
  const navigate = useNavigate();
  const form = useForm<SignInSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {
    formState: { errors },
  } = form;
  const handleSignIn: SubmitHandler<SignInSchema> = async ({
    email,
    password,
  }) => {
    try {
      await auth.signin(email, password);
    } catch (e: any) {
      form.setError("root", { message: e.message });
      return;
    }

    await navigate({
      to: "/feed-mill/material-purchase",
    });
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Logo />
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignIn)}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="x@ymail.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Please enter your email address
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                        <a
                          href="#"
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </a>
                      </div>
                      <FormControl>
                        <Input type="password" required {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <ErrorMessage
                  errors={errors}
                  name="root"
                  render={({ message }) => (
                    <p className="text-[0.8rem] font-medium text-destructive">
                      {message}
                    </p>
                  )}
                />
                <Button type="submit" className="w-full">
                  {form.formState.isSubmitting && <Loader />}
                  Login
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                <pre>
                  Don&apos;t have an account?{" "}
                  <Link to="/signup" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </pre>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
