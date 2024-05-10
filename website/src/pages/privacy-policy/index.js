import LayoutFour from "../../components/Layout/LayoutOne";
import { Breadcrumb, BreadcrumbItem } from "../../components/Other/Breadcrumb";
import IntroductionOne from "../../components/Sections/Introduction/IntroductionOne";
import introductionOneData from "../../data/introduction/introductionOne.json";
import axios from "axios";
import { baseUrl } from "../../../config";
import PrivacyPolicy from "../../components/Sections/PrivacyPolicy/PrivacyPolicy";

export default function () {
  return (
    <LayoutFour title="Privacy Policy">
      <Breadcrumb title="Privacy Policy">
        <BreadcrumbItem name="Home" path={"/"} />
        <BreadcrumbItem name="Privacy Policy" current />
      </Breadcrumb>
      {/* <IntroductionOne data={introductionOneData} /> */}
      <PrivacyPolicy />
    </LayoutFour>
  );
}
