// for Installment selection function -------------------------------------------
		
		function showFields(installment, paymentMode) {
            const transactionField = document.getElementById(`transaction-no-${installment}`);
            const tellMeField = document.getElementById(`tell-me-${installment}`);
			const bankField = document.getElementById(`transaction-banks-${installment}`);

            if (paymentMode === "UPI") {
                transactionField.style.display = "block";
                tellMeField.style.display = "none";
				bankField.style.display = "none";
            }  else if (paymentMode === "Bank Transfer") {
                transactionField.style.display = "none";
				bankField.style.display = "block";
                tellMeField.style.display = "none";
            } else if (paymentMode === "Other") {
                transactionField.style.display = "none";
				bankField.style.display = "none";
                tellMeField.style.display = "block";
            } else {
                transactionField.style.display = "none";
                tellMeField.style.display = "none";
				bankField.style.display = "none";
            }
        }

        function cancelSection(installment) {
            document.getElementById(`installment-${installment}`).style.display = "none";
            document.getElementById("installment-selector").value = "";
        }

        function showInstallmentDetails() {
            const selectedInstallment = document.getElementById("installment-selector").value;
            const allSections = document.querySelectorAll(".form-section");

            allSections.forEach(section => section.style.display = "none");

            if (selectedInstallment) {
                document.getElementById(`installment-${selectedInstallment}`).style.display = "block";
                header.textContent = `Installment ${selectedInstallment}`;
            }
        }