function calculateLoanSchedule(principal, annualRate, years) {
    const monthlyRate = annualRate / 100 / 12;
    const numPayments = years * 12;
    
    let schedule = [];
    let remainingBalance = principal;
    let totalInterest = 0;
    let monthlyPayment;

    // 1. Υπολογισμός Μηνιαίας Δόσης
    if (annualRate === 0) {
        monthlyPayment = principal / numPayments;
    } else {
        const powerFactor = Math.pow((1 + monthlyRate), numPayments);
        const numerator = monthlyRate * powerFactor;
        const denominator = powerFactor - 1;
        monthlyPayment = principal * (numerator / denominator);
    }

    // 2. Δημιουργία Πίνακα Αποπληρωμής
    for (let i = 1; i <= numPayments; i++) {
        let interestPaid = remainingBalance * monthlyRate;
        let principalPaid = monthlyPayment - interestPaid;
        
        // Τελευταία δόση: Διορθώνουμε το κεφάλαιο για να μηδενιστεί το υπόλοιπο
        if (i === numPayments) {
            principalPaid = remainingBalance;
            interestPaid = monthlyPayment - principalPaid;
            remainingBalance = 0;
        } else {
            remainingBalance -= principalPaid;
        }
        
        totalInterest += interestPaid;
        
        schedule.push({
            payment_number: i,
            monthly_payment: monthlyPayment,
            principal_paid: principalPaid,
            interest_paid: interestPaid,
            remaining_balance: Math.max(0.00, remainingBalance)
        });
    }

    return { monthlyPayment, totalInterest, schedule };
}


function displaySchedule(schedule) {
    const tableDiv = document.getElementById('scheduleTable');
    tableDiv.innerHTML = ''; 

    if (schedule.length === 0) {
        tableDiv.textContent = 'Δεν υπάρχουν δεδομένα αποπληρωμής.';
        return;
    }

    // Δημιουργία του πίνακα HTML
    let tableHTML = '<table>';
    
    // Κεφαλίδες
    tableHTML += `
        <thead>
            <tr>
                <th>Δόση</th>
                <th>Δόση (€)</th>
                <th>Κεφάλαιο (€)</th>
                <th>Τόκος (€)</th>
                <th>Υπόλοιπο (€)</th>
            </tr>
        </thead>
        <tbody>
    `;

    // Γραμμές πίνακα
    schedule.forEach(entry => {
        tableHTML += `
            <tr>
                <td>${entry.payment_number}</td>
                <td>${entry.monthly_payment.toFixed(2)}</td>
                <td>${entry.principal_paid.toFixed(2)}</td>
                <td>${entry.interest_paid.toFixed(2)}</td>
                <td>${entry.remaining_balance.toFixed(2)}</td>
            </tr>
        `;
    });

    tableHTML += '</tbody></table>';
    tableDiv.innerHTML = tableHTML;
}

function handleLoanCalculation(event) {
    event.preventDefault(); 
    
    const principal = parseFloat(document.getElementById('principal').value);
    const annualRate = parseFloat(document.getElementById('rate').value);
    const years = parseInt(document.getElementById('years').value);
    
    if (isNaN(principal) || isNaN(annualRate) || isNaN(years) || principal <= 0 || years <= 0) {
        document.getElementById('monthlyPayment').textContent = 'Μη έγκυρη είσοδος!';
        document.getElementById('totalInterest').textContent = '...';
        document.getElementById('scheduleTable').innerHTML = 'Παρακαλώ συμπληρώστε σωστά τα πεδία.';
        return;
    }

    // Εκτέλεση του υπολογισμού
    const { monthlyPayment, totalInterest, schedule } = calculateLoanSchedule(principal, annualRate, years);

    // Εμφάνιση Σύνοψης
    document.getElementById('monthlyPayment').textContent = `€${monthlyPayment.toFixed(2)}`;
    document.getElementById('totalInterest').textContent = `€${totalInterest.toFixed(2)}`;
    
    // Εμφάνιση Πίνακα Αποπληρωμής
    displaySchedule(schedule);
}

// Εκκίνηση της εφαρμογής όταν φορτωθεί η σελίδα
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loanForm');
    form.addEventListener('submit', handleLoanCalculation);
    
    // Προαιρετικό: Εκτέλεση με προεπιλεγμένες τιμές κατά το φόρτωμα
    // handleLoanCalculation({ preventDefault: () => {} });
});
