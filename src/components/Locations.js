import "./locations.css"
import "./global.css"

const CarryoutLocation = ({ title, street, city, state, zip}) => {
    
    return (
        <section className="location-lp">

            <section className="locationInfoContainer-lp">
                <section className="locationTitle-lp">
                    {title}
                </section>
                <section className="addressContainer-lp">
                    
                    <section className="locationStreetContainer-lp">
                        <section className="locationStreetTitle-lp">
                            Street
                        </section>

                        <section className="locationStreet-lp">
                            {street}
                        </section>
                    </section>

                    <section className="locationCityContainer-lp">
                        <section className="locationCityTitle-lp">
                            City
                        </section>

                        <section className="locationCity-lp">
                            {city}
                        </section>
                    </section>

                    <section className="locationStateContainer-lp">
                        <section className="locationStateTitle-lp">
                            State
                        </section>

                        <section className="locationState-lp">
                            {state}
                        </section>
                    </section>

                    <section className="locationZipContainer-lp">
                        <section className="locationZipTitle-lp">
                            Zip
                        </section>

                        <section className="locationZip-lp">
                            {zip}
                        </section>
                    </section>

                </section>
                
            </section>

        </section>
    )
}

const Locations = () => {

    return(
        <div id="locationsComponent-lp">
            <div id="locationsComponentTitleContainer-lp">
                <p id="locationsComponentTitleText-lp">Locations</p>
            </div>
            <div id="imageAndAddresses-lp">
                <img id="locationsImage-lp" src="/snazzyMapsMapFinal.png" alt="Image of Map Locations"/>
                <div id="locationsContainer-lp">
                    <label htmlFor="CyberNet">
                        <CarryoutLocation
                            title="1. CyberNet"
                            street="4342 N Liberty Road"
                            city="New York City"
                            state="New York"
                            zip="10001"
                        />
                    </label>
                    <label htmlFor="TechnoCorp">
                        <CarryoutLocation 
                            title="2. TechnoCorp"
                            street="3697 S Red Planet Road"
                            city="New York City"
                            state="New York"
                            zip="70810"
                        />
                    </label>
                    <label htmlFor="SynthRunner">
                        <CarryoutLocation 
                            title="3. SynthRunner"
                            street="6201 Whispering Pines Lane"
                            city="New York City"
                            state="New York"
                            zip="03429"
                        />
                    </label>
                </div>
            </div>
        </div>
    )
}
export default Locations;