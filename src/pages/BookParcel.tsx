import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import BookingStepsHeader from "../components/booking/BookingStepsHeader";
import CustomerStep from "../components/booking/CustomerStep";
import ParcelStep from "../components/booking/ParcelStep";
import CourierStep, { type CourierOption } from "../components/booking/CourierStep";
import ReviewStep from "../components/booking/ReviewStep";
import BookingSuccessModal from "../components/booking/BookingSuccessModal";

const steps = ["Customer Details", "Parcel Details", "Courier Selection", "Review & Confirm"];

const couriers: CourierOption[] = [
  { name: "Steadfast", days: "1–2 Days", charge: 110, codRate: 0.01, districts: 64, score: 5, recommended: true },
  { name: "Pathao", days: "1–3 Days", charge: 120, codRate: 0.01, districts: 64, score: 4, recommended: false },
  { name: "RedX", days: "2–4 Days", charge: 130, codRate: 0.012, districts: 60, score: 4, recommended: false },
];

export default function BookParcel() {
  const [searchParams] = useSearchParams();
  const { addParcel, checkPhoneRisk, settings } = useData();

  const [step, setStep] = useState(0);
  const [selectedCourierIdx, setSelectedCourierIdx] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [bookedParcelId, setBookedParcelId] = useState<string | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState("Rahim Uddin");
  const [phone, setPhone] = useState(searchParams.get("phone") || "01711234567");
  const [address, setAddress] = useState("House 12, Road 5, Mirpur-10");
  const [district, setDistrict] = useState("Dhaka");
  const [area, setArea] = useState("Mirpur-10");
  const [addressNotes, setAddressNotes] = useState("");

  const [productName, setProductName] = useState("Cotton Casual Shirt");
  const [category, setCategory] = useState("Fashion & Clothing");
  const [weight, setWeight] = useState("Up to 500g");
  const [parcelType, setParcelType] = useState("Standard");
  const [codAmount, setCodAmount] = useState<number>(1500);
  const [advancePayment, setAdvancePayment] = useState<number>(0);
  const [specialInstructions, setSpecialInstructions] = useState("Call customer before delivery");

  // Dynamic Risk evaluation
  const [customerRisk, setCustomerRisk] = useState<"Safe" | "Moderate" | "High Risk">("Safe");
  const [riskScore, setRiskScore] = useState(12);

  useEffect(() => {
    if (phone.length >= 10) {
      const res = checkPhoneRisk(phone, customerName);
      setCustomerRisk(res.risk);
      setRiskScore(res.score);
    }
  }, [phone]);

  const selectedCourier = couriers[selectedCourierIdx];
  const deliveryCharge = district === "Dhaka" ? selectedCourier.charge : selectedCourier.charge + 40;
  const codFee = Math.round(codAmount * selectedCourier.codRate);
  const merchantCollection = Math.max(0, codAmount - deliveryCharge - codFee + advancePayment);

  const handleConfirmBooking = () => {
    const newParcel = addParcel({
      customer: customerName || "Customer",
      phone: phone || "01700000000",
      address: address || "Dhaka",
      district: district || "Dhaka",
      area: area || "",
      product: productName || "General Item",
      category,
      weight,
      courier: selectedCourier.name,
      cod: codAmount || 0,
      charge: deliveryCharge,
      advance: advancePayment || 0,
      risk: customerRisk,
      status: "Pending Pickup",
      notes: specialInstructions,
      agentName: selectedCourier.name === "Steadfast" ? "Md. Hasan Ali" : "Tanvir Ahmed",
      agentPhone: "01700-123456",
    });

    setBookedParcelId(newParcel.id);
  };

  if (bookedParcelId) {
    return (
      <BookingSuccessModal
        bookedParcelId={bookedParcelId}
        customerName={customerName}
        phone={phone}
        address={address}
        district={district}
        productName={productName}
        codAmount={codAmount}
        selectedCourierName={selectedCourier.name}
        settings={settings}
        onReset={() => {
          setBookedParcelId(null);
          setStep(0);
        }}
      />
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Book New Parcel</h1>
        <p className="text-sm text-slate-500 mt-0.5">Create and dispatch single orders with live courier rate comparison.</p>
      </div>

      <BookingStepsHeader steps={steps} step={step} setStep={setStep} />

      {step === 0 && (
        <CustomerStep
          customerName={customerName} setCustomerName={setCustomerName}
          phone={phone} setPhone={setPhone}
          address={address} setAddress={setAddress}
          district={district} setDistrict={setDistrict}
          area={area} setArea={setArea}
          addressNotes={addressNotes} setAddressNotes={setAddressNotes}
          customerRisk={customerRisk} riskScore={riskScore}
          onNext={() => setStep(1)}
        />
      )}

      {step === 1 && (
        <ParcelStep
          productName={productName} setProductName={setProductName}
          category={category} setCategory={setCategory}
          weight={weight} setWeight={setWeight}
          parcelType={parcelType} setParcelType={setParcelType}
          codAmount={codAmount} setCodAmount={setCodAmount}
          advancePayment={advancePayment} setAdvancePayment={setAdvancePayment}
          specialInstructions={specialInstructions} setSpecialInstructions={setSpecialInstructions}
          district={district} deliveryCharge={deliveryCharge} codFee={codFee} merchantCollection={merchantCollection}
          onBack={() => setStep(0)} onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <CourierStep
          couriers={couriers}
          selectedCourierIdx={selectedCourierIdx}
          setSelectedCourierIdx={setSelectedCourierIdx}
          district={district}
          codAmount={codAmount}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <ReviewStep
          customerName={customerName} phone={phone} address={address} district={district} area={area}
          productName={productName} category={category} weight={weight} specialInstructions={specialInstructions}
          selectedCourier={selectedCourier} deliveryCharge={deliveryCharge} codFee={codFee} codAmount={codAmount}
          merchantCollection={merchantCollection} customerRisk={customerRisk} riskScore={riskScore}
          agreed={agreed} setAgreed={setAgreed}
          onBack={() => setStep(2)} onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
}
