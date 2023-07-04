import { registerApplication, start } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";

import microfrontendLayoutDefault from "../public/template/default-layout.html";

async function getTemplate(template) {
  try {
    if (!template) throw new Error("template not exist!");
    const respose = await fetch(`/template/${template}-layout.html`);
    const responseText = await respose.text();
    customStart(responseText);
  } catch (error) {
    customStart(microfrontendLayoutDefault);
  }
  return {
    start,
  };
}

function customStart(layoutHtml) {
  const routes = constructRoutes(layoutHtml);
  const applications = constructApplications({
    routes,
    loadApp({ name }) {
      return System.import(name);
    },
  });
  const layoutEngine = constructLayoutEngine({ routes, applications });

  applications.forEach(registerApplication);
  layoutEngine.activate();
}

const template = localStorage.getItem("template");

getTemplate(template).then((res) => res.start());
