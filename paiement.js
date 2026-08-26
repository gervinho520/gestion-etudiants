const paymentForm =
    document.getElementById("paymentForm");


// =====================================================
// URL GOOGLE APPS SCRIPT
// =====================================================

const GOOGLE_SCRIPT_URL =
    "TON_URL_GOOGLE_APPS_SCRIPT";


// =====================================================
// ENREGISTREMENT DU PAIEMENT
// =====================================================

paymentForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const nom =
            document.getElementById(
                "nomPaiement"
            ).value.trim();


        const montant =
            document.getElementById(
                "montant"
            ).value;


        const date =
            document.getElementById(
                "datePaiement"
            ).value;


        const mode =
            document.getElementById(
                "modePaiement"
            ).value;


        const motif =
            document.getElementById(
                "motif"
            ).value;


        const paiement = {

            type: "paiement",

            nom: nom,

            montant: montant,

            date: date,

            mode: mode,

            motif: motif

        };


        try {

            await fetch(
                GOOGLE_SCRIPT_URL,
                {

                    method: "POST",

                    mode: "no-cors",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify(paiement)

                }
            );


            alert(
                "✅ Paiement enregistré avec succès !"
            );


            paymentForm.reset();


        }

        catch(error) {

            console.error(error);

            alert(
                "❌ Erreur lors de l'enregistrement."
            );

        }

    }
);


// =====================================================
// WHATSAPP PAIEMENT
// =====================================================

document
    .getElementById("whatsappPayment")
    .addEventListener(
        "click",
        function() {

            const nom =
                document.getElementById(
                    "nomPaiement"
                ).value;

            const montant =
                document.getElementById(
                    "montant"
                ).value;

            const date =
                document.getElementById(
                    "datePaiement"
                ).value;

            const mode =
                document.getElementById(
                    "modePaiement"
                ).value;

            const motif =
                document.getElementById(
                    "motif"
                ).value;


            if (
                !nom ||
                !montant ||
                !date ||
                !mode ||
                !motif
            ) {

                alert(
                    "Veuillez remplir tous les champs."
                );

                return;

            }


            const message =

                "💳 *PAIEMENT ÉTUDIANT*%0A%0A" +

                "👨‍🎓 Étudiant : " +
                nom +
                "%0A" +

                "💰 Montant : " +
                montant +
                " BIF%0A" +

                "📅 Date : " +
                date +
                "%0A" +

                "💳 Mode : " +
                mode +
                "%0A" +

                "📝 Motif : " +
                motif;


            const numero =
                "257XXXXXXXX";


            const url =
                "https://wa.me/" +
                numero +
                "?text=" +
                message;


            window.open(
                url,
                "_blank"
            );

        }
    );
