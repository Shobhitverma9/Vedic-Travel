const fs = require('fs');
const { MongoClient, ObjectId } = require('mongodb');

// Target packages
const TOURS = [
  // Varanasi / Prayagraj / Ayodhya
  { id: '69d1103af870c24086113ff2', name: 'Varanasi-Prayagraj-Ayodhya - Uttar Pradesh - Tour Package', weight: 40, category: 'yatra' },
  { id: '69972d35103be0bdab9e3e76', name: 'Varanasi Ayodhya Prayagraj Golden UP Yatra Packages Standard Package', weight: 20, category: 'package' },
  // Char Dham
  { id: '69ce33efe4884206cff779fb', name: 'Chardham Yatra by Road Ex-Delhi', weight: 20, category: 'yatra' },
  { id: '699048f96cb4404dddf9c4b5', name: 'Premium Char Dham Yatra by Helicopter', weight: 10, category: 'package' },
  // Bali
  { id: '69d0eebcc5c6940d878e7430', name: 'Bali Luxury Escape: Beaches, Culture & Indulgence', weight: 5, category: 'package' },
  { id: '699734450c21731fde67876f', name: 'Bali Temple Trail Standard Package', weight: 5, category: 'package' }
];

function getRandomTour() {
  const rand = Math.random() * 100;
  let sum = 0;
  for (const tour of TOURS) {
    sum += tour.weight;
    if (rand <= sum) return tour;
  }
  return TOURS[0];
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  const uri = "mongodb+srv://shobhit:shobhit@cluster0.ayg15an.mongodb.net/vedictravel?retryWrites=true&w=majority&authSource=admin";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('vedictravel');
    const bookingsCol = db.collection('bookings');
    const inquiriesCol = db.collection('inquiries');

    const csvContent = fs.readFileSync("C:\\Users\\SHOBHIT\\Downloads\\Lead for Mahakumbh.csv", 'utf-8');
    const lines = csvContent.split('\n').filter(l => l.trim() !== '');
    
    // Skip header
    const dataLines = lines.slice(1);
    
    let bookingsCount = 0;
    let inquiriesCount = 0;

    const startDate = new Date('2025-01-01T00:00:00Z');
    const endDate = new Date('2026-08-13T00:00:00Z'); // Current date

    const generateId = () => Math.random().toString(36).substring(2, 10).toUpperCase();

    for (const line of dataLines) {
      const parts = line.split(',');
      if (parts.length < 6) continue;
      
      let [fname, lname, email, phone, city, state] = parts.map(p => p.replace(/^['"]|['"]$/g, '').trim());
      phone = phone.replace(/^['"]/, ''); // clean phone if it has extra quote
      
      const tour = getRandomTour();
      const isBooking = Math.random() < 0.075; // ~7.5% booking rate
      const createdAtDate = randomDate(startDate, endDate);
      const travelDateObj = new Date(createdAtDate.getTime() + (Math.random() * 60 + 15) * 24 * 60 * 60 * 1000);

      const adultCount = Math.floor(Math.random() * 4) + 1;
      
      if (isBooking) {
        // Create Booking
        const totalAmt = (Math.floor(Math.random() * 500) + 150) * 100 * adultCount;
        const paidAmt = totalAmt;
        
        const travelers = [];
        travelers.push({
          name: `${fname} ${lname}`,
          age: Math.floor(Math.random() * 40) + 20,
          gender: Math.random() > 0.5 ? 'Male' : 'Female',
          idProof: 'Aadhar'
        });
        
        for (let i = 1; i < adultCount; i++) {
           travelers.push({
             name: `Traveler ${i+1}`,
             age: Math.floor(Math.random() * 40) + 20,
             gender: Math.random() > 0.5 ? 'Male' : 'Female',
             idProof: 'Aadhar'
           });
        }

        const booking = {
          tour: new ObjectId(tour.id),
          numberOfTravelers: adultCount,
          travelDate: travelDateObj,
          totalAmount: totalAmt,
          paidAmount: paidAmt,
          departureCity: city,
          citySurcharge: 0,
          paymentStatus: 'success',
          paymentId: 'pay_' + generateId(),
          payuTransactionId: 'txn_' + generateId(),
          bookingStatus: 'confirmed',
          travelerDetails: travelers,
          email: email,
          phone: phone,
          billingAddress: {
            title: 'Mr',
            firstName: fname,
            lastName: lname,
            addressLine: 'Generated Address',
            state: state,
            city: city,
            pincode: '000000',
            email: email,
            mobile: phone
          },
          isGuest: true,
          paymentMethod: 'payu',
          bookingReference: 'VT-' + generateId(),
          notificationsSent: true,
          createdAt: createdAtDate,
          updatedAt: createdAtDate,
          __v: 0
        };
        await bookingsCol.insertOne(booking);
        bookingsCount++;
      } else {
        // Create Inquiry
        const inquiry = {
          name: `${fname} ${lname}`,
          email: email,
          mobile: phone,
          adults: adultCount,
          children: 0,
          infants: 0,
          message: 'Interested in this package. Please call me.',
          tourId: tour.id,
          tourName: tour.name,
          yatraId: tour.category === 'yatra' ? tour.id : undefined,
          yatraName: tour.category === 'yatra' ? tour.name : undefined,
          status: 'new',
          isCorporate: false,
          journeyDate: travelDateObj.toISOString().split('T')[0],
          budget: 'Flexible',
          isCustomizable: true,
          createdAt: createdAtDate,
          updatedAt: createdAtDate,
          __v: 0
        };
        await inquiriesCol.insertOne(inquiry);
        inquiriesCount++;
      }
    }

    console.log(`Successfully imported leads! Created ${bookingsCount} bookings and ${inquiriesCount} inquiries.`);

  } finally {
    await client.close();
  }
}

main().catch(console.dir);
