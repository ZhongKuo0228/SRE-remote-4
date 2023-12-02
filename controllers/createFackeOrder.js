import { randomNumber } from "../util/randomNumber.js";
import { createFakeDateTime, createFakeTime } from "../util/time.js";
import { insertPackageOrder, insertTrackingRecordDetail, queryPackageStatusBySnoId } from "../models/orderManage.js";

// 建立 package detail

export const createFakeOrder = async () => {
    const fakeDate = createFakeDateTime({ years: 2023, minMonth: 2, maxMonth: 10, days: 28 });
    const fakeRecipientId = randomNumber(1, 15);
    const snoId = await insertPackageOrder({ estimated_delivery: fakeDate, recipient: fakeRecipientId });
    return { snoId: snoId, fakeDate: fakeDate };
};

export const createFakeOrderDetailByFakeDate = async (sno_id, fakeDate, dayOffset) => {
    const fakeTime = createFakeTime(fakeDate, dayOffset);
    const fakeStatusId = randomNumber(1, 8);
    const locationId = randomNumber(1, 11);
    await insertTrackingRecordDetail({ sno: sno_id, time: fakeTime, status: fakeStatusId, location: locationId });
    return;
};

export const randomBuildOrder = async (quantity) => {
    let result = [];
    for (let i = 0; i < quantity; i++) {
        const newOrderData = await createFakeOrder();
        const randomTrackingRecordQuantity = randomNumber(1, 5);
        const startTime = createFakeTime(newOrderData.fakeDate, -randomTrackingRecordQuantity);
        for (let i = 1; i < randomTrackingRecordQuantity; i++) {
            await createFakeOrderDetailByFakeDate(newOrderData.snoId, startTime, i);
        }
        result.push(newOrderData.snoId);
    }
    return result;
};

export const getPackageStatusBySnoId = async (sno_id) => {
    try {
        const data = await queryPackageStatusBySnoId(sno_id);
        if (!data || data.length === 0) {
            return null;
        }
        const { estimated_delivery, recipient_id, recipient_name, recipient_address, recipient_phone } = data[0];
        const formattedEstimatedDelivery = estimated_delivery.toISOString().split("T")[0];

        const details = data.slice(0, -1).map((record) => ({
            id: record.tracking_id,
            date: record.update_time.toISOString().split("T")[0],
            time: record.update_time.toISOString().split("T")[1].substring(0, 5),
            status: record.status,
            location_id: record.location_id,
            location_title: record.title,
        }));

        const lastRecord = data[data.length - 1];

        return {
            sno: sno_id,
            tracking_status: lastRecord.status,
            estimated_delivery: formattedEstimatedDelivery,
            details: details,
            recipient: {
                id: recipient_id,
                name: recipient_name,
                address: recipient_address,
                phone: recipient_phone,
            },
            current_location: {
                location_id: lastRecord.location_id,
                title: lastRecord.title,
                city: lastRecord.city,
                address: lastRecord.address,
            },
        };
    } catch (error) {
        throw { message: error };
    }
};

await getPackageStatusBySnoId(1000);
