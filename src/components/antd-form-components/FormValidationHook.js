import { useState, useEffect } from "react";
import { Form } from "antd";

const useFormValidation = (form) => {
  const [submittable, setSubmittable] = useState(false);
  const values = Form.useWatch([], form);

  useEffect(() => {
    const validateForm = async () => {
      try {
        await form.validateFields();
        setSubmittable(true);
      } catch (error) {
        setSubmittable(false);
      }
    };

    validateForm();
  }, [form, values]);

  return submittable;
};

export default useFormValidation;
