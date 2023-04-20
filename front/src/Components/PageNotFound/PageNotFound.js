import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PageNotFound = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 1500);
  }, []);

  return <h1>Page Not Found</h1>;
};

export default PageNotFound;
