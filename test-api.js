const baseUrl = 'http://localhost:3000/api';

async function runTests() {
    console.log('🚀 Starting API Verification Tests...\n');

    let token = '';
    let serviceId = '';
    let bookingId = '';

    // Helper for making requests
    async function request(path, method = 'GET', body = null, authToken = null) {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const options = {
            method,
            headers,
        };
        if (body) {
            options.body = JSON.stringify(body);
        }

        const res = await fetch(`${baseUrl}${path}`, options);
        const text = await res.text();
        let data = null;
        try {
            data = text ? JSON.parse(text) : null;
        } catch (e) {
            data = text;
        }

        return {
            status: res.status,
            data,
        };
    }

    // 1. Register User
    console.log('1. Registering a new admin user...');
    const regRes = await request('/auth/register', 'POST', {
        email: `admin_${Date.now()}@example.com`,
        password: 'password123',
    });
    if (regRes.status === 201) {
        console.log('✅ User registered successfully:', regRes.data.email);
    } else {
        console.error('❌ User registration failed:', regRes.data);
        return;
    }

    // 2. Login User
    console.log('\n2. Logging in...');
    const loginRes = await request('/auth/login', 'POST', {
        email: regRes.data.email,
        password: 'password123',
    });
    if (loginRes.status === 200) {
        token = loginRes.data.accessToken;
        console.log('✅ Login successful. Token acquired.');
    } else {
        console.error('❌ Login failed:', loginRes.data);
        return;
    }

    // 3. Create a Service
    console.log('\n3. Creating a service (Authenticated)...');
    const serviceRes = await request('/services', 'POST', {
        title: 'Full Grooming Package',
        description: 'Includes wash, haircut, nail trimming, and ear cleaning.',
        duration: 60,
        price: 75.0,
    }, token);
    if (serviceRes.status === 201) {
        serviceId = serviceRes.data.id;
        console.log('✅ Service created successfully. ID:', serviceId);
    } else {
        console.error('❌ Service creation failed:', serviceRes.data);
        return;
    }

    // 4. Create a Booking (Public)
    console.log('\n4. Creating a booking (Public)...');
    const bookingDate = '2026-12-25';
    const bookingTime = '10:00';
    const bookingRes = await request('/bookings', 'POST', {
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        customerPhone: '+15551234567',
        serviceId,
        bookingDate,
        bookingTime,
        notes: 'Please handle with care.',
    });
    if (bookingRes.status === 201) {
        bookingId = bookingRes.data.id;
        console.log('✅ Booking created successfully. ID:', bookingId);
    } else {
        console.error('❌ Booking creation failed:', bookingRes.data);
        return;
    }

    // 5. Attempt to create a duplicate booking (Should fail with 409 Conflict)
    console.log('\n5. Attempting to create duplicate booking (Same service, date, time)...');
    const dupRes = await request('/bookings', 'POST', {
        customerName: 'Jane Smith',
        customerEmail: 'jane.smith@example.com',
        customerPhone: '+15559876543',
        serviceId,
        bookingDate,
        bookingTime,
    });
    if (dupRes.status === 409) {
        console.log('✅ Duplicate booking correctly blocked with 409 Conflict:', dupRes.data.message);
    } else {
        console.error('❌ Duplicate booking test failed. Status:', dupRes.status, dupRes.data);
    }

    // 6. Attempt to create a booking in the past (Should fail with 400 Bad Request)
    console.log('\n6. Attempting to create booking in the past...');
    const pastRes = await request('/bookings', 'POST', {
        customerName: 'Old Customer',
        customerEmail: 'old@example.com',
        customerPhone: '+15550000000',
        serviceId,
        bookingDate: '2020-01-01',
        bookingTime: '12:00',
    });
    if (pastRes.status === 400) {
        console.log('✅ Past booking correctly blocked with 400 Bad Request:', pastRes.data.message);
    } else {
        console.error('❌ Past booking test failed. Status:', pastRes.status, pastRes.data);
    }

    // 7. Get All Bookings (Authenticated)
    console.log('\n7. Fetching all bookings (Authenticated)...');
    const allBookingsRes = await request('/bookings', 'GET', null, token);
    if (allBookingsRes.status === 200) {
        console.log(`✅ Successfully fetched bookings. Total count: ${allBookingsRes.data.total}`);
    } else {
        console.error('❌ Fetching bookings failed:', allBookingsRes.data);
    }

    // 8. Update Booking Status to CONFIRMED (Authenticated)
    console.log('\n8. Updating booking status to CONFIRMED (Authenticated)...');
    const statusRes = await request(`/bookings/${bookingId}/status`, 'PATCH', {
        status: 'CONFIRMED',
    }, token);
    if (statusRes.status === 200) {
        console.log('✅ Booking status updated successfully to:', statusRes.data.status);
    } else {
        console.error('❌ Updating booking status failed:', statusRes.data);
    }

    // 9. Cancel Booking (Public/Authenticated)
    console.log('\n9. Cancelling booking...');
    const cancelRes = await request(`/bookings/${bookingId}/cancel`, 'PATCH');
    if (cancelRes.status === 200) {
        console.log('✅ Booking cancelled successfully. Status:', cancelRes.data.status);
    } else {
        console.error('❌ Cancelling booking failed:', cancelRes.data);
    }

    // 10. Attempt to complete a cancelled booking (Should fail with 400 Bad Request)
    console.log('\n10. Attempting to complete cancelled booking...');
    const completeRes = await request(`/bookings/${bookingId}/status`, 'PATCH', {
        status: 'COMPLETED',
    }, token);
    if (completeRes.status === 400) {
        console.log('✅ Completed status transition for cancelled booking correctly blocked with 400 Bad Request:', completeRes.data.message);
    } else {
        console.error('❌ Cancelled-to-completed test failed. Status:', completeRes.status, completeRes.data);
    }

    console.log('\n🏁 API Verification Tests Completed.');
}

runTests().catch(console.error);
