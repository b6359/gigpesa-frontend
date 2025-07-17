import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
type FormState = {
  name: string;
  username: string;
  email: string;
  password: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  gender: string;
  country: string;
  securityAnswer: string;
  countrySearch: string;
  agree: boolean;
  referrer: string;
};

const countries = [
  "DZ - Algeria",
  "AO - Angola",
  "BJ - Benin",
  "BW - Botswana",
  "BF - Burkina Faso",
  "BI - Burundi",
  "CV - Cabo Verde",
  "CM - Cameroon",
  "CF - Central African Republic",
  "TD - Chad",
  "KM - Comoros",
  "CG - Congo",
  "CD - Democratic Republic of the Congo",
  "CI - Côte d’Ivoire",
  "DJ - Djibouti",
  "EG - Egypt",
  "GQ - Equatorial Guinea",
  "ER - Eritrea",
  "SZ - Eswatini",
  "ET - Ethiopia",
  "GA - Gabon",
  "GM - Gambia",
  "GH - Ghana",
  "GN - Guinea",
  "GW - Guinea-Bissau",
  "KE - Kenya",
  "LS - Lesotho",
  "LR - Liberia",
  "LY - Libya",
  "MG - Madagascar",
  "MW - Malawi",
  "ML - Mali",
  "MR - Mauritania",
  "MU - Mauritius",
  "MA - Morocco",
  "MZ - Mozambique",
  "NA - Namibia",
  "NE - Niger",
  "NG - Nigeria",
  "RW - Rwanda",
  "ST - São Tomé and Príncipe",
  "SN - Senegal",
  "SC - Seychelles",
  "SL - Sierra Leone",
  "SO - Somalia",
  "ZA - South Africa",
  "SS - South Sudan",
  "SD - Sudan",
  "TZ - Tanzania",
  "TG - Togo",
  "TN - Tunisia",
  "UG - Uganda",
  "ZM - Zambia",
  "ZW - Zimbabwe",

  // North America
  "AG - Antigua and Barbuda",
  "BS - Bahamas",
  "BB - Barbados",
  "BZ - Belize",
  "CA - Canada",
  "CR - Costa Rica",
  "CU - Cuba",
  "DM - Dominica",
  "DO - Dominican Republic",
  "SV - El Salvador",
  "GD - Grenada",
  "GT - Guatemala",
  "HT - Haiti",
  "HN - Honduras",
  "JM - Jamaica",
  "MX - Mexico",
  "NI - Nicaragua",
  "PA - Panama",
  "KN - Saint Kitts and Nevis",
  "LC - Saint Lucia",
  "VC - Saint Vincent and the Grenadines",
  "TT - Trinidad and Tobago",
  "US - United States",

  // Europe
  "AL - Albania",
  "AD - Andorra",
  "AM - Armenia",
  "AT - Austria",
  "AZ - Azerbaijan",
  "BY - Belarus",
  "BE - Belgium",
  "BA - Bosnia and Herzegovina",
  "BG - Bulgaria",
  "HR - Croatia",
  "CY - Cyprus",
  "CZ - Czech Republic",
  "DK - Denmark",
  "EE - Estonia",
  "FI - Finland",
  "FR - France",
  "GE - Georgia",
  "DE - Germany",
  "GR - Greece",
  "HU - Hungary",
  "IS - Iceland",
  "IE - Ireland",
  "IT - Italy",
  "XK - Kosovo",
  "LV - Latvia",
  "LI - Liechtenstein",
  "LT - Lithuania",
  "LU - Luxembourg",
  "MT - Malta",
  "MD - Moldova",
  "MC - Monaco",
  "ME - Montenegro",
  "NL - Netherlands",
  "MK - North Macedonia",
  "NO - Norway",
  "PL - Poland",
  "PT - Portugal",
  "RO - Romania",
  "RU - Russia",
  "SM - San Marino",
  "RS - Serbia",
  "SK - Slovakia",
  "SI - Slovenia",
  "ES - Spain",
  "SE - Sweden",
  "CH - Switzerland",
  "UA - Ukraine",
  "GB - United Kingdom",
  "VA - Vatican City",

  // Asia
  "AF - Afghanistan",
  "BH - Bahrain",
  "BD - Bangladesh",
  "BT - Bhutan",
  "BN - Brunei",
  "KH - Cambodia",
  "CN - China",
  "IN - India",
  "ID - Indonesia",
  "IR - Iran",
  "IQ - Iraq",
  "IL - Israel",
  "JP - Japan",
  "JO - Jordan",
  "KZ - Kazakhstan",
  "KW - Kuwait",
  "KG - Kyrgyzstan",
  "LA - Laos",
  "LB - Lebanon",
  "MY - Malaysia",
  "MV - Maldives",
  "MN - Mongolia",
  "MM - Myanmar",
  "NP - Nepal",
  "KP - North Korea",
  "OM - Oman",
  "PK - Pakistan",
  "PS - Palestine",
  "PH - Philippines",
  "QA - Qatar",
  "SA - Saudi Arabia",
  "SG - Singapore",
  "KR - South Korea",
  "LK - Sri Lanka",
  "SY - Syria",
  "TJ - Tajikistan",
  "TH - Thailand",
  "TL - Timor-Leste",
  "TR - Turkey",
  "TM - Turkmenistan",
  "AE - United Arab Emirates",
  "UZ - Uzbekistan",
  "VN - Vietnam",
  "YE - Yemen",

  // South America
  "AR - Argentina",
  "BO - Bolivia",
  "BR - Brazil",
  "CL - Chile",
  "CO - Colombia",
  "EC - Ecuador",
  "GY - Guyana",
  "PY - Paraguay",
  "PE - Peru",
  "SR - Suriname",
  "UY - Uruguay",
  "VE - Venezuela",
];

interface AuthModalProps {
  type: "register" | "signin";
  open: boolean;
  onClose: () => void;
  referrerCode?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({
  type,
  open,
  onClose,
  referrerCode,
}) => {
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState<"signin" | "register" | "forgot">(
    "signin"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    gender: "",
    country: "",
    securityAnswer: "",
    countrySearch: "",
    agree: false,
    referrer: "",
  });

  useEffect(() => {
    const stored =
      referrerCode || sessionStorage.getItem("gigpesa_referrer") || "";
    if (stored) setForm((p) => ({ ...p, referrer: stored }));
  }, [referrerCode]);

  useEffect(() => {
    setAuthMode(type);
    setErrors(null);
  }, [type]);

  function handleChange<K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const isOldEnough = () => {
    const { dobDay, dobMonth, dobYear } = form;

    if (!dobDay || !dobMonth || !dobYear || parseInt(dobYear) < 1990)
      return false;

    const dob = new Date(`${dobYear}-${dobMonth}-${dobDay}`);
    if (isNaN(dob.getTime())) return false;

    const ageDifMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDifMs);

    return Math.abs(ageDate.getUTCFullYear() - 1970) >= 16;
  };

  const validateForm = () => {
    const {
      name,
      username,
      email,
      password,
      dobDay,
      dobMonth,
      dobYear,
      gender,
      country,
      agree,
      securityAnswer,
    } = form;

    if (authMode === "forgot") {
      if (!email) return "Email is required.";
      if (!securityAnswer) return "Security answer is required.";
      return null;
    }

    if (authMode === "signin") {
      if (!email || !password) return "Email and password are required.";
      return null;
    }

    if (authMode === "register") {
      if (
        !name ||
        !username ||
        !email ||
        !password ||
        !dobDay ||
        !dobMonth ||
        !dobYear ||
        !gender ||
        !country ||
        !agree ||
        !securityAnswer
      ) {
        return "All fields are required.";
      }

      if (!isOldEnough())
        return "You must be at least 16 years old to register.";

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(password)) {
        return "Password must include uppercase, lowercase, and a number.";
      }

      const usernameRegex = /^(?=.*[a-z])(?=.*\d)(?=.*_)[a-z0-9_]{5,6}$/;
      if (!usernameRegex.test(username)) {
        return "Username must be 5–6 characters long, lowercase, and must include at least one letter, one number, and one underscore.";
      }

      return null;
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setErrors(error);
      return;
    }

    setErrors(null);
    setLoading(true);

    const baseUrl = "http://192.168.1.24:5000";
    const url =
      authMode === "register"
        ? `${baseUrl}/api/register`
        : authMode === "forgot"
        ? `${baseUrl}/api/forgot-password`
        : `${baseUrl}/api/login`;

    const payload =
      authMode === "register"
        ? {
            name: form.name,
            username: form.username,
            email: form.email,
            password: form.password,
            gender: form.gender,
            country: form.country,
            securityAnswer: form.securityAnswer,
            referrer: form.referrer,

            dob: `${form.dobYear}-${form.dobMonth.padStart(
              2,
              "0"
            )}-${form.dobDay.padStart(2, "0")}`,
          }
        : authMode === "forgot"
        ? {
            email: form.email,
            securityAnswer: form.securityAnswer,
          }
        : {
            email: form.email,
            password: form.password,
          };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        const msg =
          typeof data === "string"
            ? data
            : data?.message || `Server error: ${res.status}`;
        setErrors(msg);
        toast.error(msg);
        return;
      }

      const { token, user, message } = data;

      if ((authMode === "register" || authMode === "signin") && token && user) {
        sessionStorage.setItem("gigpesa_token", token);
        sessionStorage.setItem("gigpesa_user", JSON.stringify(user));

        toast.success(
          message ||
            (authMode === "register"
              ? `Welcome to GigPesa, ${user.username}!`
              : `Welcome back, ${user.username}!`),
          { duration: 6000 }
        );

        onClose();
        navigate("/dashboard");
      } else if (authMode === "forgot") {
        toast.success(message || "Check your email to reset your password.", {
          duration: 6000,
        });
        onClose();
      } else {
        toast.error("Unexpected response format.");
      }
    } catch (err) {
      console.error("Network error:", err);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotClick = () => {
    setAuthMode("forgot");
    setErrors(null);
  };

  const handleBackToSignIn = () => {
    setAuthMode("signin");
    setErrors(null);
  };

  const isRegister = authMode === "register";
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-md max-h-[90vh] overflow-y-auto px-6 py-6 rounded-2xl shadow-lg bg-white">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-medium text-green-600 text-center">
            {isRegister
              ? "Create Your GigPesa Account"
              : authMode === "forgot"
              ? "Reset Your Password"
              : "Sign In"}
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-2 text-center max-w-md mx-auto">
            {isRegister
              ? "Join GigPesa today. It's fast and free."
              : authMode === "forgot"
              ? "We'll send a reset link to your email."
              : "Welcome back! Please enter your details."}
          </p>
        </DialogHeader>

        {isRegister && form.referrer && referrerCode && (
          <div className="rounded-md bg-green-50 border text-center border-green-200 px-2 py-1 text-sm text-green-800">
            <span className="font-semibold text-center">{form.referrer}</span>
          </div>
        )}
        <ScrollArea className="h-full">
          <form onSubmit={handleSubmit} className="space-y-3 px-4 sm:px-6 ">
            {isRegister && (
              <>
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </Label>

                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Your Name"
                    required
                    className="focus-visible:ring-green-600 rounded-xl placeholder:text-sm placeholder:font-light font-light"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={form.username}
                    onChange={(e) =>
                      handleChange("username", e.target.value.toLowerCase())
                    }
                    placeholder="Unique username"
                    required
                    className="focus-visible:ring-green-600 rounded-xl placeholder:text-sm placeholder:font-light font-light"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="securityAnswer">Security Answer</Label>
                  <Input
                    id="securityAnswer"
                    value={form.securityAnswer}
                    onChange={(e) =>
                      handleChange("securityAnswer", e.target.value)
                    }
                    placeholder="whats your favourite colour"
                    required
                    className="focus-visible:ring-green-600 rounded-xl placeholder:text-sm placeholder:font-light font-light"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Used for password recovery.
                  </p>
                </div>

                <div className="space-y-2 w-full">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    <div className="space-y-2">
                      <Label htmlFor="dobDay">Day</Label>
                      <Input
                        id="dobDay"
                        type="number"
                        inputMode="numeric"
                        value={form.dobDay}
                        onChange={(e) =>
                          handleChange(
                            "dobDay",
                            e.target.value.replace(/\D/g, "").slice(0, 2)
                          )
                        }
                        placeholder="DD"
                        required
                        className="focus-visible:ring-green-600 rounded-xl placeholder:text-sm placeholder:font-light font-light"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dobMonth">Month</Label>
                      <Input
                        id="dobMonth"
                        type="number"
                        inputMode="numeric"
                        value={form.dobMonth}
                        onChange={(e) =>
                          handleChange(
                            "dobMonth",
                            e.target.value.replace(/\D/g, "").slice(0, 2)
                          )
                        }
                        placeholder="MM"
                        required
                        className="focus-visible:ring-green-600 rounded-xl placeholder:text-sm placeholder:font-light font-light"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dobYear">Year</Label>
                      <Input
                        id="dobYear"
                        type="number"
                        inputMode="numeric"
                        min={1990}
                        value={form.dobYear}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4);
                          handleChange("dobYear", value);
                        }}
                        placeholder="YYYY"
                        required
                        className="focus-visible:ring-green-600 rounded-xl placeholder:text-sm placeholder:font-light font-light"
                      />
                      {/* Conditional Warning */}
                      {form.dobYear &&
                        form.dobYear.length === 4 &&
                        parseInt(form.dobYear) < 1990 && (
                          <p className="text-xs text-red-500 font-light mt-1">
                            Only accepts years from 1990
                          </p>
                        )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 w-full">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    onValueChange={(val) => handleChange("gender", val)}
                    required
                  >
                    <SelectTrigger
                      id="gender"
                      className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none text-sm sm:text-base font-light"
                    >
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <div className="border rounded-md p-2">
                    <button
                      id="country"
                      type="button"
                      className="w-full text-left px-3 py-2 border rounded-md font-light"
                      onClick={() => setShowCountryDropdown((prev) => !prev)}
                    >
                      {form.country || "Select country"}
                    </button>
                    {showCountryDropdown && (
                      <div className="relative border rounded-md p-2">
                        <Input
                          type="text"
                          placeholder="Search country..."
                          className="focus-visible:ring-green-600 rounded-xl placeholder:text-sm placeholder:font-light font-light"
                          value={form.countrySearch || ""}
                          onChange={(e) =>
                            handleChange(
                              "countrySearch",
                              e.target.value.toLowerCase()
                            )
                          }
                        />
                        <ScrollArea className="h-40 border rounded-md mt-2">
                          <div className="flex flex-col">
                            {countries
                              .filter((c) =>
                                c
                                  .toLowerCase()
                                  .includes(
                                    (form.countrySearch || "").toLowerCase()
                                  )
                              )
                              .map((c) => (
                                <button
                                  key={c}
                                  type="button"
                                  className={`text-left px-3 py-2 hover:bg-gray-100 ${
                                    form.country === c
                                      ? "bg-gray-00 font-medium"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    handleChange("country", c);
                                    setShowCountryDropdown(false);
                                  }}
                                >
                                  {c}
                                </button>
                              ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="you@example.com"
                required
                className="focus-visible:ring-green-600 rounded-xl placeholder:text-sm placeholder:font-light font-light"
              />
            </div>

            {(authMode === "signin" || isRegister) && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="••••••••"
                    className="focus-visible:ring-green-600 rounded-xl placeholder:text-sm placeholder:font-light font-light"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-2.5 text-gray-500 hover:text-black"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {isRegister && (
                  <p className="text-xs text-gray-500 mt-1">
                    Must be 8+ characters, include uppercase, lowercase, and a
                    number.| Must be 16 years plus to Register.
                  </p>
                )}
              </div>
            )}

            {!isRegister && authMode === "signin" && (
              <div className="text-right text-sm">
                <button
                  type="button"
                  onClick={handleForgotClick}
                  className="text-green-700 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {authMode === "forgot" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="securityAnswer">Security Answer</Label>
                  <Input
                    id="securityAnswer"
                    value={form.securityAnswer}
                    onChange={(e) =>
                      handleChange("securityAnswer", e.target.value)
                    }
                    placeholder="What is your favorite color?"
                    required
                    className="focus-visible:ring-green-600 rounded-xl placeholder:text-sm placeholder:font-light font-light"
                  />
                </div>

                <div className="text-right text-sm">
                  <button
                    type="button"
                    onClick={handleBackToSignIn}
                    className="text-green-700 hover:underline"
                  >
                    Back to Sign In
                  </button>
                </div>
              </>
            )}

            {isRegister && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={form.agree}
                  onCheckedChange={(checked) =>
                    handleChange("agree", Boolean(checked))
                  }
                  className="data-[state=checked]:bg-green-700 data-[state=checked]:border-green-700"
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-700 underline hover:text-green-900"
                  >
                    terms and conditions
                  </a>
                  .
                </Label>
              </div>
            )}

            {errors && (
              <div className="text-red-600 text-sm font-medium">{errors}</div>
            )}

            <Button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 transition flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Processing...
                </>
              ) : isRegister ? (
                "Register"
              ) : authMode === "forgot" ? (
                "Send Reset Link"
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
