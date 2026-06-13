import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { OrderPage } from "./pages/OrderPage";
import { PatientPage } from "./pages/PatientPage";
import { AppointmentPage } from "./pages/AppointmentPage";
import { ExaminationPage } from "./pages/ExaminationPage";
import { ChartPage } from "./pages/ChartPage";
import { ExternalInfoPage } from "./pages/ExternalInfoPage";
import { ConsultationPage } from "./pages/ConsultationPage";
import { DocumentPage } from "./pages/DocumentPage";
import { DocumentUploadPage } from "./pages/DocumentUploadPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: OrderPage },
      { path: "order", Component: OrderPage },
      { path: "patient", Component: PatientPage },
      { path: "appointment", Component: AppointmentPage },
      { path: "examination", Component: ExaminationPage },
      { path: "chart", Component: ChartPage },
      { path: "external-info", Component: ExternalInfoPage },
      { path: "consultation", Component: ConsultationPage },
      { path: "document", Component: DocumentPage },
      { path: "document-upload", Component: DocumentUploadPage },
    ],
  },
]);
