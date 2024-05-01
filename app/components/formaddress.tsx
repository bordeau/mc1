import React from "react";

const country_states = [
  {
    country: "USA",
    states: [
      { code: "AL", name: "Alabama" },
      { code: "AK", name: "Alaska" },
      { code: "AZ", name: "Arizona" },
      { code: "AR", name: "Arkansas" },
      { code: "AS", name: "American Samoa" },
      { code: "CA", name: "California" },
      { code: "CO", name: "Colorado" },
      { code: "CT", name: "Connecticut" },
      { code: "DE", name: "Delaware" },
      { code: "DC", name: "District of Columbia" },
      { code: "FL", name: "Florida" },
      { code: "GA", name: "Georgia" },
      { code: "GU", name: "Guam" },
      { code: "HI", name: "Hawaii" },
      { code: "ID", name: "Idaho<" },
      { code: "IL", name: "Illinois" },
      { code: "IN", name: "Indiana" },
      { code: "IA", name: "Iowa" },
      { code: "KS", name: "Kansas" },
      { code: "KY", name: "Kentucky" },
      { code: "LA", name: "Louisiana" },
      { code: "ME", name: "Maine" },
      { code: "MD", name: "Maryland" },
      { code: "MA", name: "Massachusetts" },
      { code: "MI", name: "Michigan" },
      { code: "MN", name: "Minnesota" },
      { code: "MS", name: "Mississippi" },
      { code: "MO", name: "Missouri" },
      { code: "MT", name: "Montana" },
      { code: "NE", name: "Nebraska" },
      { code: "NV", name: "Nevada" },
      { code: "NH", name: "New Hampshire" },
      { code: "NJ", name: "New Jersey" },
      { code: "NM", name: "New Mexico" },
      { code: "NY", name: "New York" },
      { code: "NC", name: "North Carolina" },
      { code: "ND", name: "North Dakota" },
      { code: "MP", name: "Northern Mariana Islands" },
      { code: "OH", name: "Ohio" },
      { code: "OK", name: "Oklahoma" },
      { code: "OR", name: "Oregon" },
      { code: "PA", name: "Pennsylvania" },
      { code: "PR", name: "Puerto Rico" },
      { code: "RI", name: "Rhode Island" },
      { code: "SC", name: "South Carolina" },
      { code: "SD", name: "South Dakota" },
      { code: "TN", name: "Tennessee" },
      { code: "TX", name: "Texas" },
      { code: "TT", name: "Trust Territories" },
      { code: "UT", name: "Utah" },
      { code: "VT", name: "Vermont" },
      { code: "VA", name: "Virginia" },
      { code: "VI", name: "Virgin Islands" },
      { code: "WA", name: "Washington" },
      { code: "WV", name: "West Virginia" },
      { code: "WI", name: "Wisconsin" },
      { code: "WY", name: "Wyoming" },
    ],
  },
  {
    country: "CAN",
    states: [
      { code: "AB", name: "Alberta" },
      { code: "BC", name: "British Columbia" },
      { code: "MB", name: "Manitoba" },
      { code: "NB", name: "New Brunswick" },
      { code: "NL", name: "Newfoundland and Labrador" },
      { code: "NT", name: "Northwest Territories<" },
      { code: "NU", name: "Nunavut" },
      { code: "PE", name: "Prince Edward Island" },
      { code: "ON", name: "Ontario" },
      { code: "QC", name: "Quebec" },
      { code: "SK", name: "Saskatchewan" },
      { code: "YT", name: "Yukon Territories" },
    ],
  },
];

const countries = [
  { code: "USA", name: "United States of America" },
  { code: "CAN", name: "Canada" },
];

function getStatesByCountry(c) {
  const item = country_states.find((i) => i.country === c);
  // console.log("\n\ngetstates: " + JSON.stringify(item.states));
  // console.log("\n\n");
  //console.log("\n\n getStatesByCountry:" + JSON.stringify(item));
  if (item === undefined) return [];
  return item.states;
}

export default function FormAddress(props) {
  // console.log("\n\n\nformaddress props: " + JSON.stringify(props));

  const data = props.data;

  const [selected, setSelected] = React.useState("");
  const changeSelectOptionHandler = (event) => {
    setSelected(event.target.value);
  };
  let states = [];
  if (selected != "" || props.country != null) {
    //  console.log("\n\n selected: " + selected + " country: " + props.country);
    if (selected != "") states = getStatesByCountry(selected);
    else if (props.country != null) states = getStatesByCountry(props.country);
    // console.log("\n\n states: " + JSON.stringify(states));
  }
  return (
    <>
      <div className="container">
        <h4>{props.typeLabel}</h4>
        <input type="hidden" name="addressType" value={props.type} />
        <div className="row">
          <div className="col">
            <div className="mg-3">
              <label htmlFor="street1" className="form-label">
                Street 1:
              </label>

              <input
                defaultValue={props.street1}
                name="street1"
                type="text"
                className="form-control"
              />

              {data && data.error.street1 && (
                <p className="text-danger">{data.error.street1._errors[0]}</p>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className="mg-3">
              <label htmlFor="street2" className="form-label">
                Street 2:
              </label>

              <input
                defaultValue={props.street2}
                name="street2"
                type="text"
                className="form-control"
              />
              {data && data.error.street2 && (
                <p className="text-danger">{data.error.street2._errors[0]}</p>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className="mg-3">
              <label htmlFor="city" className="form-label">
                City:
              </label>

              <input
                defaultValue={props.city}
                name="city"
                type="text"
                className="form-control"
              />
              {data && data.error.city && (
                <p className="text-danger">{data.error.city._errors[0]}</p>
              )}
            </div>
          </div>
          <div className="col">
            <div className="mg-3">
              <label htmlFor="state" className="form-label">
                State/Province:
              </label>

              <select
                id="state"
                name="state"
                className="form-control"
                defaultValue={props.state}
              >
                <option value="">Choose State/Province/Territory</option>
                {states.map((st) => (
                  <option key={st.code} value={st.code}>
                    {st.name}
                  </option>
                ))}
              </select>
              {data && data.error.state && (
                <p className="text-danger">{data.error.state._errors[0]}</p>
              )}
            </div>
          </div>

          <div className="col">
            <div className="mg-3">
              <label htmlFor="zip" className="form-label">
                Zip/Postal Code:
              </label>

              <input
                defaultValue={props.zip}
                name="zip"
                type="text"
                className="form-control"
              />
              {data && data.error.zip && (
                <p className="text-danger">{data.error.zip._errors[0]}</p>
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="mg-3">
              <label htmlFor="country" className="form-label">
                Country:
              </label>

              <select
                name="country"
                className="form-control"
                defaultValue={props.country}
                onChange={changeSelectOptionHandler}
              >
                <option value="">Choose Country</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
              {data && data.error.country && (
                <p className="text-danger">{data.error.country._errors[0]}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
