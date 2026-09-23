import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Building2, CheckCircle2 } from 'lucide-react';
import Field from '../../components/Field';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import * as authService from '../../services/authService';

const initialForm = {
  universityName: '',
  domain: '',
  country: '',
  city: '',
  website: '',
  adminName: '',
  adminEmail: '',
  phone: '',
  password: '',
  confirmPassword: '',
  authorized: false,
};

export default function RegisterUniversity() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const set = (key) => (e) => {
    const value = e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.universityName.trim()) next.universityName = 'Enter your university name.';
    if (!form.city.trim()) next.city = 'Enter your city.';
    if (!form.country.trim()) next.country = 'Enter your country.';
    if (!form.adminName.trim()) next.adminName = 'Enter the administrator\u2019s name.';
    if (!form.adminEmail.trim() || !form.adminEmail.includes('@')) next.adminEmail = 'Enter a valid administrator email.';
    if (!form.password) next.password = 'Create a password.';
    else if (form.password.length < 6) next.password = 'Use at least 6 characters.';
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords don\u2019t match.';
    if (!form.authorized) next.authorized = 'You must confirm you are authorized to register this institution.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;
    setSubmitting(true);
    const res = await authService.registerUniversity(form);
    setSubmitting(false);
    if (res.ok) {
      await refreshUser();
      setSuccess(true);
    } else {
      setSubmitError(res.error || 'Something went wrong. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="success-shell">
        <div className="card success-card">
          <div className="success-icon-wrap"><CheckCircle2 size={30} /></div>
          <h1>University registration submitted.</h1>
          <p>
            Your institution profile has been created for this prototype. In the production version,
            administrator verification would happen before activation.
          </p>
          <Button variant="primary" block onClick={() => navigate('/admin')} style={{ marginTop: 12 }}>
            Continue to admin dashboard
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
          <h1>Bring UniAssist to your campus</h1>
          <p>Register your institution to give students a safe way to report and stay informed.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <Field label="University name" htmlFor="uni-name" error={errors.universityName}>
            <Input id="uni-name" placeholder="Capital University of Science & Technology" value={form.universityName} onChange={set('universityName')} error={errors.universityName} />
          </Field>

          <div className="grid-2">
            <Field label="Country" htmlFor="uni-country" error={errors.country}>
              <Input id="uni-country" placeholder="Pakistan" value={form.country} onChange={set('country')} error={errors.country} />
            </Field>
            <Field label="City" htmlFor="uni-city" error={errors.city}>
              <Input id="uni-city" placeholder="Islamabad" value={form.city} onChange={set('city')} error={errors.city} />
            </Field>
          </div>

          <Field label="University website" htmlFor="uni-website" optional>
            <Input id="uni-website" placeholder="https://university.edu" value={form.website} onChange={set('website')} />
          </Field>

          <div className="grid-2">
            <Field label="Administrator name" htmlFor="uni-admin-name" error={errors.adminName}>
              <Input id="uni-admin-name" placeholder="Full name" value={form.adminName} onChange={set('adminName')} error={errors.adminName} />
            </Field>
            <Field label="Administrator email" htmlFor="uni-admin-email" error={errors.adminEmail}>
              <Input id="uni-admin-email" type="email" placeholder="admin@university.edu" value={form.adminEmail} onChange={set('adminEmail')} error={errors.adminEmail} />
            </Field>
          </div>

          <Field label="Phone" htmlFor="uni-phone" optional>
            <Input id="uni-phone" placeholder="+92 300 0000000" value={form.phone} onChange={set('phone')} />
          </Field>

          <div className="grid-2">
            <Field label="Password" htmlFor="uni-password" error={errors.password}>
              <Input id="uni-password" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} error={errors.password} />
            </Field>
            <Field label="Confirm password" htmlFor="uni-confirm" error={errors.confirmPassword}>
              <Input id="uni-confirm" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} />
            </Field>
          </div>

          <label className="checkbox-row">
            <input type="checkbox" checked={form.authorized} onChange={set('authorized')} />
            I confirm that I am authorized to register this institution.
          </label>
          {errors.authorized && <span className="field-error">{errors.authorized}</span>}

          {submitError && <span className="field-error">{submitError}</span>}

          <Button type="submit" variant="primary" block loading={submitting} icon={Building2}>
            Register University
          </Button>
        </form>

        <p className="auth-footer-note">
          Registering as a student instead? <Link to="/register/student">Create a student account</Link>
        </p>
      </div>
    </div>
  );
}
