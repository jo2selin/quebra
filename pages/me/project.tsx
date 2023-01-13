import React from "react";

import { useRouter } from "next/router";
import EditProject from "../../components/projects/editProject";
import CreateProject from "../../components/projects/createProject";

const Project: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;

  return slug ? <EditProject slug={slug as string} /> : <CreateProject />;
};

export default Project;
