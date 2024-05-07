import React from "react";
import { EmptyLetterTray } from "~/components/icons";

export default function PlainAddress(props) {
  //console.log("\n\n\naddress props: " + JSON.stringify(props));

  return (
    <div className="accordion" id="addressAccordian">
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingOne">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="false"
            aria-controls="collapseOne"
          >
            {props.typeLabel}
          </button>
        </h2>
        <div
          id="collapseOne"
          className="accordion-collapse collapse"
          aria-labelledby="headingOne"
          data-bs-parent="#addressAccordian"
        >
          <div className="row">
            <h6 className="col-2 align-text-top">Street 1</h6>
            <p className="col-9 lead align-text-top">
              {props.street1 ? props.street1 : <EmptyLetterTray />}
            </p>
          </div>

          <div className="row">
            <h6 className="col-2 align-text-top">Street 2</h6>
            <p className="col-9 lead align-text-top">
              {props.street2 ? props.street2 : <EmptyLetterTray />}
            </p>
          </div>

          <div className="row">
            <h6 className="col-2 align-text-top">City</h6>
            <p className="col-3 lead align-text-top">
              {props.city ? props.city : <EmptyLetterTray />}
            </p>

            <h6 className="col-1 align-text-top">State</h6>
            <p className="col-2 lead align-text-top">
              {props.state ? props.state : <EmptyLetterTray />}
            </p>

            <h6 className="col-1 align-text-top">Zip</h6>
            <p className="col-2 lead align-text-top">
              {props.zip ? props.zip : <EmptyLetterTray />}
            </p>
          </div>

          <div className="row">
            <h6 className="col-2 align-text-top">Country</h6>
            <p className="col-2 lead align-text-top">
              {props.country ? props.country : <EmptyLetterTray />}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
