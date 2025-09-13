// resources/js/Components/FieldError.jsx
export default function FieldError({ children }) {
  if (!children) return null;
  return <span className="text-sm text-red-600">{children}</span>;
}
