export default function PlainAddress(props) {
  console.log("\n\n\naddress props: " + JSON.stringify(props));

  return (
    <>
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
            <input type="hidden" name="type" value={props.type} />
            <div className="row">
              <div className="col">
                <div className="mg-3">
                  <p className="h6">Street 1:</p>
                  <p className="lead">{props.street1}</p>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <div className="mg-3">
                  <p className="h6">Street 2:</p>
                  <p className="lead">{props.street2}</p>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <div className="mg-3">
                  <p className="h6">City:</p>
                  <p className="lead">{props.city}</p>
                </div>
              </div>
              <div className="col">
                <div className="mg-3">
                  <p className="h6">State/Province:</p>
                  <p className="lead">{props.state}</p>
                </div>
              </div>

              <div className="col">
                <div className="mg-3">
                  <p className="h6">Zip/Postal Code:</p>
                  <p className="lead">{props.zip}</p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="mg-3">
                  <p className="h6">Country:</p>
                  <p className="lead">{props.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
