function Findus() {
    return (
    <section className="ubicacion py-5">
        <div className="container">
            <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
                <h2 className="mb-3">Nuestra Ubicación</h2>
                <p>
                Hoseki Joyería<br />
                Av. Italia 1295, Providencia, Chile<br />
                Lunes a Viernes: 10:00 - 20:00<br />
                Sábado: 10:00 - 17:00<br />
                <b>¡Te esperamos!</b>
                </p>
            </div>
            <div className="col-md-6">
                <div style={{borderRadius: 8, overflow: 'hidden'}}>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6658.215323212563!2d-70.6277511233195!3d-33.446501497311495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c57e85867d9d%3A0x59aa4bf64f75e08b!2sAv.%20Italia%201295%2C%207501464%20Providencia%2C%20Regi%C3%B3n%20Metropolitana%2C%20Chile!5e0!3m2!1ses-419!2sus!4v1757305697257!5m2!1ses-419!2sus" width={600} height={450} style={{border: 0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade">
                </iframe>
                </div>
            </div>
            </div>
        </div>
    </section>

    )
}

export default Findus;