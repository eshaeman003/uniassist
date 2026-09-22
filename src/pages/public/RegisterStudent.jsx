import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, UserPlus, CheckCircle2 } from 'lucide-react';
import Field from '../../components/Field';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import * as authService from '../../services/authService';
import { getUniversities } from '../../services/universityService';

const initialForm = {
  universityId: '',
  name: '',
  studentId: '',
  email: '',
  password: '',
  confirmPassword: '',
  agree: false,
};

export default function RegisterStudent() {
  const [universities, setUniversities] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    getUniversities().then(setUniversities);
  }, []);

  const set = (key) => (e) => {
    const value = e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.universityId) next.universityId = 'Select your university.';
    if (!form.name.trim()) next.name = 'Enter your full name.';
    if (!form.studentId.trim()) next.studentId = 'Enter your university registration number.';
    if (!form.email.trim()) {
      next.email = 'Enter your university email.';
    } else if (form.universityId && !authService.isEmailDomainValid(form.email, universities, form.universityId)) {
      const uni = universities.find((u) => u.id === form.universityId);
      next.email = `Use your ${uni?.shortName} email (must end in @${uni?.emailDomain}).`;
    }
    if (!form.password) next.password = 'Create a password.';
    else if (form.password.length < 6) next.password = 'Use at least 6 characters.';
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords don\u2019t match.';
    if (!form.agree) next.agree = 'You must agree to continue.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const res = await authService.registerStudent(form);
    setSubmitting(false);
    if (!res.ok) {
      setErrors({ email: res.error });
      return;
    }
    await refreshUser();
    setSuccess(true);
  };

  if (success) {
    const uni = universities.find((u) => u.id === form.universityId);
    return (
      <div className="success-shell">
        <div className="card success-card">
          <div className="success-icon-wrap"><CheckCircle2 size={30} /></div>
          <h1>Demo verification successful.</h1>
          <p>
            Your UniAssist account has been created for <strong>{uni?.name}</strong>. In the production version, a
            real verification email would confirm your university address first.
          </p>
          <Button variant="primary" block onClick={() => navigate('/app')} style={{ marginTop: 12 }}>
            Go to my dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <div className="auth-card wide">
        <div className="auth-head">
          <div className="brand" style={{ marginBottom: 16 }}>
            <span className="brand-mark"><GraduationCap size={18} /></span>
            UniAssist
          </div>
          <h1>Create your UniAssist account</h1>
          <p>Register with your university email to get started.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <Field label="University" htmlFor="reg-university" error={errors.universityId}>
            <Select id="reg-university" value={form.universityId} onChange={set('universityId')} error={errors.universityId}>
              <option value="">Select your university</option>
              {universities.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </Select>
          </Field>

          <Field label="Student name" htmlFor="reg-name" error={errors.name}>
            <Input id="reg-name" placeholder="Esha Ahmed" value={form.name} onChange={set('name')} error={errors.name} />
          </Field>

          <div className="grid-2">
            <Field label="University registration number" htmlFor="reg-studentid" hint="e.g. SE-23-1234" error={errors.studentId}>
              <Input id="reg-studentid" placeholder="SE-23-1234" value={form.studentId} onChange={set('studentId')} error={errors.studentId} />
            </Field>
            <Field label="University email" htmlFor="reg-email" hint="e.g. esha@cust.edu.pk" error={errors.email}>
              <Input id="reg-email" type="email" placeholder="esha@cust.edu.pk" value={form.email} onChange={set('email')} error={errors.email} />
            </Field>
          </div>

          <div className="grid-2">
            <Field label="Password" htmlFor="reg-password" error={errors.password}>
              <Input id="reg-password" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} error={errors.password} />
            </Field>
            <Field label="Confirm password" htmlFor="reg-confirm" error={errors.confirmPassword}>
              <Input id="reg-confirm" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} />
            </Field>
          </div>

          <label className="checkbox-row">
            <input type="checkbox" checked={form.agree} onChange={set('agree')} />
            I agree to the UniAssist terms and privacy policy.
          </label>
          {errors.agree && <span className="field-error">{errors.agree}</span>}

          <Button type="submit" variant="primary" block loading={submitting} icon={UserPlus}>
            Create Student Account
          </Button>
        </form>

        <p className="auth-footer-note">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}