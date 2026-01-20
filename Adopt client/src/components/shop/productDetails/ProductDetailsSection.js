import React, { Fragment, useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { ProductDetailsContext } from "./index";
import { LayoutContext } from "../layout";
import Submenu from "./Submenu";
import ProductDetailsSectionTwo from "./ProductDetailsSectionTwo";

import { getAllProducts, getMatchExplanation, getSingleProduct, sendMail } from "./FetchApi";
import { cartListProduct } from "../partials/FetchApi";
import { isWishReq, unWishReq, isWish } from "../home/Mixins";
import { slideImage, cartList } from "./Mixins";

const ProductDetailsSection = () => {
  const { id } = useParams();
  const { data, dispatch } = useContext(ProductDetailsContext);
  const { data: layoutData, dispatch: layoutDispatch } =
    useContext(LayoutContext);

  const sProduct = layoutData.singleProductDetail;

  /* ---------------- READINESS SCORE ---------------- */
  const calculateReadinessScore = (product) => {
    if (!product) return 0;
    let score = 0;

    if (product.pStatus === "Active") score += 30;
    if (product.pPrice <= 5) score += 30;
    else score += 10;
    if (product.photos?.length >= 2) score += 20;
    if (product.pDescription?.length > 50) score += 20;

    return score;
  };

  const readinessScore = calculateReadinessScore(sProduct);

  /* ---------------- MATCH QUIZ ---------------- */
  const [homeType, setHomeType] = useState("");
  const [time, setTime] = useState("");
  const [family, setFamily] = useState("");
  const [matchScore, setMatchScore] = useState(null);

  const [allPets, setAllPets] = useState([]);
  const [matchResults, setMatchResults] = useState([]);
  const [aiExplanations, setAiExplanations] = useState({});

  const calculateMatch = () => {
    let score = 0;
    if (homeType === "House") score += 20;
    if (time === "More") score += 30;
    if (family === "Kids") score += 20;
    setMatchScore(score);
  };

  const normalizeText = (val) => (val || "").toString().toLowerCase();

  const inferPetType = (pet) => {
    const fromCategory = normalizeText(pet?.pCategory?.cName);
    if (fromCategory.includes("dog")) return "dog";
    if (fromCategory.includes("cat")) return "cat";

    const fromDesc = normalizeText(pet?.pDescription);
    if (fromDesc.includes("dog")) return "dog";
    if (fromDesc.includes("cat")) return "cat";
    return "other";
  };

  const computeMatchScore = (pet, profile) => {
    let score = 50;

    const petType = inferPetType(pet);
    const desc = normalizeText(pet?.pDescription);
    const age = Number(pet?.pPrice);

    if (profile.homeType === "Apartment") {
      if (petType === "cat") score += 15;
      if (petType === "dog") score -= 5;
    }

    if (profile.homeType === "House") {
      if (petType === "dog") score += 10;
    }

    if (profile.timeAvailability === "Less") {
      if (desc.includes("calm") || desc.includes("gentle") || desc.includes("independent")) score += 10;
      if (desc.includes("active") || desc.includes("energetic") || desc.includes("playful")) score -= 10;
    }

    if (profile.timeAvailability === "More") {
      if (desc.includes("active") || desc.includes("energetic") || desc.includes("playful")) score += 10;
    }

    if (profile.kidsOrFamily === "Kids") {
      if (desc.includes("friendly") || desc.includes("kids") || desc.includes("gentle")) score += 10;
    }

    if (!Number.isNaN(age)) {
      if (profile.kidsOrFamily === "Kids" && age >= 2) score += 5;
      if (profile.timeAvailability === "Less" && age >= 3) score += 5;
    }

    if (pet?.pStatus === "Active") score += 5;
    if (pet?.photos?.length) score += 5;

    return Math.max(0, Math.min(100, score));
  };

  const buildUserProfile = () => ({
    homeType,
    timeAvailability: time === "More" ? "More" : time === "Less" ? "Less" : "",
    kidsOrFamily: family,
  });

  const fetchAllPetsOnce = async () => {
    if (allPets.length) return allPets;
    const res = await getAllProducts();
    const pets = res?.Products || [];
    setAllPets(pets);
    return pets;
  };

  const runMatchmaker = async () => {
    const profile = buildUserProfile();
    const pets = await fetchAllPetsOnce();
    const ranked = (pets || [])
      .filter((p) => p?._id && p._id !== id)
      .map((p) => ({ pet: p, score: computeMatchScore(p, profile) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    setMatchResults(ranked);
    setAiExplanations({});

    ranked.forEach(async ({ pet }) => {
      const petId = pet?._id;
      if (!petId) return;

      setAiExplanations((prev) => ({
        ...prev,
        [petId]: { loading: true, text: "" },
      }));

      const response = await getMatchExplanation({ userProfile: profile, pet });
      setAiExplanations((prev) => ({
        ...prev,
        [petId]: {
          loading: false,
          text: response?.success ? response?.explanation : response?.message || "",
        },
      }));
    });
  };

  /* ---------------- OLD STATES ---------------- */
  const [pImages, setPimages] = useState([]);
  const [count, setCount] = useState(0);

  const [wList, setWlist] = useState(
    JSON.parse(localStorage.getItem("wishList")) || []
  );

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  /* ---------------- FETCH PRODUCT ---------------- */
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    dispatch({ type: "loading", payload: true });

    try {
      const responseData = await getSingleProduct(id);
      if (responseData?.Product) {
        layoutDispatch({
          type: "singleProductDetail",
          payload: responseData.Product,
        });
        setPimages(responseData.Product.photos || []);
        layoutDispatch({ type: "inCart", payload: cartList() });
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch({ type: "loading", payload: false });
      fetchCartProduct();
    }
  };

  const fetchCartProduct = async () => {
    try {
      const responseData = await cartListProduct();
      if (responseData?.Products) {
        layoutDispatch({
          type: "cartProduct",
          payload: responseData.Products,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* ---------------- SEND MAIL ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sProduct?._id) return;

    const response = await sendMail({
      email,
      phone,
      id,
      petName: sProduct.pName,
    });

    if (response?.status === 200) {
      setEmailSent(true);
    }
  };

  /* ---------------- LOADING ---------------- */
  if (data.loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading product details...
      </div>
    );
  }

  if (!sProduct) {
    return (
      <div className="flex justify-center items-center h-screen">
        Product not found
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <Fragment>
      <Submenu
        value={{
          categoryId: sProduct.pCategory?._id,
          product: sProduct.pName,
          category: sProduct.pCategory?.cName,
        }}
      />

      <section className="m-4 md:mx-12 md:my-6">
        <div className="grid grid-cols-2 md:grid-cols-12">

          {/* Thumbnails */}
          <div className="hidden md:block md:col-span-1 space-y-4 mr-2">
            {sProduct.photos.map((img, i) => (
              <img
                key={i}
                onClick={() =>
                  slideImage("increase", i, count, setCount, pImages)
                }
                className={`${
                  count === i ? "" : "opacity-25"
                } cursor-pointer w-20 h-20 object-cover`}
                src={img.secure_url}
                alt="pic"
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="col-span-2 md:col-span-7">
            <img
              style={{ width: "500px", height: "500px" }}
              src={sProduct.photos[count]?.secure_url}
              alt="Pic"
            />
          </div>

          {/* Product Info */}
          <div className="col-span-2 mt-8 md:col-span-4 md:ml-6 lg:ml-12">
            <div className="flex flex-col leading-8">
              <div className="text-2xl tracking-wider">{sProduct.pName}</div>

              <div className="flex justify-between items-center">
                <span className="text-xl tracking-wider text-yellow-700">
                  Age {sProduct.pPrice}
                </span>

                <span>
                  <svg
                    onClick={(e) => isWishReq(e, sProduct._id, setWlist)}
                    className={`${
                      isWish(sProduct._id, wList) && "hidden"
                    } w-6 h-6 cursor-pointer text-yellow-700`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>

                  <svg
                    onClick={(e) => unWishReq(e, sProduct._id, setWlist)}
                    className={`${
                      !isWish(sProduct._id, wList) && "hidden"
                    } w-6 h-6 cursor-pointer text-yellow-700`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
            </div>

            <div className="my-4 text-gray-600">
              {sProduct.pDescription}
            </div>

            {/* 🆕 READINESS SCORE */}
            <div className="border p-3 rounded bg-green-50 mb-4">
              <strong>🐾 Adoption Readiness:</strong>
              <div className="text-xl font-bold">{readinessScore}%</div>
              <small>
                {readinessScore >= 70
                  ? "Excellent for adoption ✅"
                  : "Needs special care ⚠️"}
              </small>
            </div>

            {/* 🆕 MATCH QUIZ */}
            <div className="border p-3 rounded bg-purple-50 mb-4">
              <strong>🤝 Adoption Match Quiz</strong>

              <select className="w-full border my-1 p-1" onChange={(e) => setHomeType(e.target.value)}>
                <option value="">Home Type</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
              </select>

              <select className="w-full border my-1 p-1" onChange={(e) => setTime(e.target.value)}>
                <option value="">Time Availability</option>
                <option value="Less">Less</option>
                <option value="More">More</option>
              </select>

              <select className="w-full border my-1 p-1" onChange={(e) => setFamily(e.target.value)}>
                <option value="">Family</option>
                <option value="Kids">Kids</option>
                <option value="Adults">Adults</option>
              </select>

              <button
                onClick={() => {
                  calculateMatch();
                  runMatchmaker();
                }}
                className="w-full mt-2 bg-black text-white py-1"
              >
                Check Match
              </button>

              {matchScore !== null && (
                <p className="mt-2 font-bold">{matchScore}% Match</p>
              )}

              {matchResults.length > 0 ? (
                <div className="mt-4 space-y-3">
                  <div className="text-sm font-semibold">Recommended pets for you</div>
                  {matchResults.map(({ pet, score }) => (
                    <div key={pet._id} className="bg-white border rounded p-3">
                      <div className="flex items-start space-x-3">
                        <img
                          src={pet?.photos?.[0]?.secure_url}
                          alt="pet"
                          className="w-16 h-16 object-cover rounded bg-gray-100"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-semibold">{pet.pName}</div>
                            <div className="text-xs font-semibold text-green-700">
                              {score}%
                            </div>
                          </div>

                          <div className="text-xs text-gray-600 mt-1">
                            Age {pet.pPrice}
                          </div>

                          <div className="text-xs text-gray-700 mt-2">
                            {aiExplanations?.[pet._id]?.loading
                              ? "Generating AI explanation..."
                              : aiExplanations?.[pet._id]?.text || ""}
                          </div>

                          <button
                            type="button"
                            onClick={() => window.location.assign(`/products/${pet._id}`)}
                            className="mt-2 text-xs px-3 py-1 border"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {/* OLD CONTACT FORM */}
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                className="border px-4 py-2 w-full mb-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                className="border px-4 py-2 w-full mb-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <button
                type="submit"
                className="w-full px-4 py-2 text-white"
                style={{ background: "#303031" }}
              >
                I wanna Adopt
              </button>

              {emailSent && (
                <p className="mt-2 text-green-600">
                  Email received. We will contact you soon.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      <ProductDetailsSectionTwo />
    </Fragment>
  );
};

export default ProductDetailsSection;
