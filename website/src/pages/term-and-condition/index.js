import LayoutFour from "../../components/Layout/LayoutOne";
import { Breadcrumb, BreadcrumbItem } from "../../components/Other/Breadcrumb";
import IntroductionOne from "../../components/Sections/Introduction/IntroductionOne";
import introductionOneData from "../../data/introduction/introductionOne.json";
import axios from "axios";
import { baseUrl } from "../../../config";
import TermsAndConditions from "../../components/Sections/Terms/Terms";

export default function () {
  return (
    <LayoutFour title="Terms & Conditions">
      <Breadcrumb title="Terms & Conditions">
        <BreadcrumbItem name="Home" path={"/"} />
        <BreadcrumbItem name="Terms & Conditions" current />
      </Breadcrumb>
      {/* <IntroductionOne data={introductionOneData} /> */}
      <TermsAndConditions />
    </LayoutFour>
  );
}
