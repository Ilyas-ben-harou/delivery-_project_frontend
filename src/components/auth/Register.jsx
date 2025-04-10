import React, { useState } from "react";
import axios from "axios";
const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    motDePasse: "",
    confirmMotDePasse: "",
    boutique: "",
    cin: "",
    banque: "AL BARID BANK",
    rib: "",
    ville: "CASABLANCA",
    adresse: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validation basique
    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";

    // Validation téléphone (format marocain)
    const phoneRegex = /^212[0-9]{9}$/;
    if (!phoneRegex.test(formData.telephone)) {
      newErrors.telephone = "Format invalide (00212 suivi de 9 chiffres)";
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    // Validation mot de passe
    if (formData.motDePasse.length < 8) {
      newErrors.motDePasse =
        "Le mot de passe doit contenir au moins 8 caractères";
    }

    // Confirmation mot de passe
    if (formData.motDePasse !== formData.confirmMotDePasse) {
      newErrors.confirmMotDePasse = "Les mots de passe ne correspondent pas";
    }

    // Validation RIB (24 chiffres pour le Maroc)
    const ribRegex = /^[0-9]{24}$/;
    if (!ribRegex.test(formData.rib)) {
      newErrors.rib = "Le RIB doit contenir 24 chiffres";
    }

    // Autres validations
    if (!formData.boutique.trim())
      newErrors.boutique = "Nom de boutique requis";
    if (!formData.cin.trim()) newErrors.cin = "CIN requis";
    if (!formData.termsAccepted)
      newErrors.termsAccepted = "Vous devez accepter les mentions légales";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Reset errors
    setErrors({});

    // Set up loading state if needed
    // setIsLoading(true);

    try {
      // Make API call to Laravel backend
      const response = await axios.post(
        "http://your-laravel-api-url/api/register",
        formData
      );

      console.log("Registration successful:", response.data);

      // Show success message or redirect user
      // setSuccessMessage('Registration successful! Please check your email for verification.');
      // Or redirect: history.push('/registration-success');
    } catch (error) {
      // Handle API errors
      console.error("Registration error:", error);

      if (error.response && error.response.data && error.response.data.errors) {
        // Set validation errors from the server
        //setErrors(error.response.data.errors);
      } else {
        // Set general error message
        //setGeneralError('An error occurred during registration. Please try again.');
      }
    } finally {
      // Clear loading state if needed
      // setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
        <p className=" text-blue-900">Créer votre compte</p>
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-left">
          Livrer avec Bolt
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom et Prénom */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="nom"
                className="block text-sm font-medium text-gray-700"
              >
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                placeholder="Nom de famille"
                className={`mt-1 block w-full border ${
                  errors.nom ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              />
              {errors.nom && (
                <p className="mt-1 text-sm text-red-500">{errors.nom}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="prenom"
                className="block text-sm font-medium text-gray-700"
              >
                Prénom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
                placeholder="Prénom"
                className={`mt-1 block w-full border ${
                  errors.prenom ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              />
              {errors.prenom && (
                <p className="mt-1 text-sm text-red-500">{errors.prenom}</p>
              )}
            </div>
          </div>

          {/* Téléphone et Email */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="telephone"
                className="block text-sm font-medium text-gray-700"
              >
                Numéro de téléphone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                required
                placeholder="212000000000"
                className={`mt-1 block w-full border ${
                  errors.telephone ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              />
              <p className="mt-1 text-xs text-gray-500">
                Format: 00212 0 00 00 00 00
              </p>
              {errors.telephone && (
                <p className="mt-1 text-sm text-red-500">{errors.telephone}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="exemple@exemple.com"
                className={`mt-1 block w-full border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Mot de passe */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="motDePasse"
                className="block text-sm font-medium text-gray-700"
              >
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="motDePasse"
                name="motDePasse"
                value={formData.motDePasse}
                onChange={handleChange}
                required
                className={`mt-1 block w-full border ${
                  errors.motDePasse ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              />
              {errors.motDePasse && (
                <p className="mt-1 text-sm text-red-500">{errors.motDePasse}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmMotDePasse"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmez mot de passe <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="confirmMotDePasse"
                name="confirmMotDePasse"
                value={formData.confirmMotDePasse}
                onChange={handleChange}
                required
                className={`mt-1 block w-full border ${
                  errors.confirmMotDePasse
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              />
              {errors.confirmMotDePasse && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmMotDePasse}
                </p>
              )}
            </div>
          </div>

          {/* Boutique et CIN */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="boutique"
                className="block text-sm font-medium text-gray-700"
              >
                Boutique <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="boutique"
                name="boutique"
                value={formData.boutique}
                onChange={handleChange}
                required
                className={`mt-1 block w-full border ${
                  errors.boutique ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              />
              {errors.boutique && (
                <p className="mt-1 text-sm text-red-500">{errors.boutique}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="cin"
                className="block text-sm font-medium text-gray-700"
              >
                CIN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="cin"
                name="cin"
                value={formData.cin}
                onChange={handleChange}
                required
                className={`mt-1 block w-full border ${
                  errors.cin ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              />
              {errors.cin && (
                <p className="mt-1 text-sm text-red-500">{errors.cin}</p>
              )}
            </div>
          </div>

          {/* Banque et RIB */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="banque"
                className="block text-sm font-medium text-gray-700"
              >
                Banque <span className="text-red-500">*</span>
              </label>
              <select
                id="banque"
                name="banque"
                value={formData.banque}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="AL BARID BANK">AL BARID BANK</option>
                <option value="BMCE">BMCE</option>
                <option value="BMCI">BMCI</option>
                <option value="ATTIJARI">ATTIJARI</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="rib"
                className="block text-sm font-medium text-gray-700"
              >
                RIB <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="rib"
                name="rib"
                value={formData.rib}
                onChange={handleChange}
                required
                placeholder="000000000000000000000000"
                className={`mt-1 block w-full border ${
                  errors.rib ? "border-bleu-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              />
              {errors.rib && (
                <p className="mt-1 text-sm text-red-500">{errors.rib}</p>
              )}
            </div>
          </div>

          {/* Ville et Pack */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="ville"
                className="block text-sm font-medium text-gray-700"
              >
                Ville <span className="text-red-500">*</span>
              </label>
              <select
                id="ville"
                name="ville"
                value={formData.ville}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="ADISS">ADISS</option>
                <option value="CASABLANCA">CASABLANCA</option>
                <option value="RABAT">RABAT</option>
                <option value="MARRAKECH">MARRAKECH</option>
              </select>
            </div>
          </div>

          {/* Adresse */}
          <div>
            <label
              htmlFor="adresse"
              className="block text-sm font-medium text-gray-700"
            >
              Adresse
            </label>
            <input
              type="text"
              id="adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Conditions */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="termsAccepted"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                required
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="termsAccepted"
                className={`font-medium ${
                  errors.termsAccepted ? "text-red-500" : "text-gray-700"
                }`}
              >
                J'ai lu et compris les{" "}
                <span className="text-indigo-600 cursor-pointer hover:underline">
                  Mentions légales
                </span>
                .
              </label>
              {errors.termsAccepted && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.termsAccepted}
                </p>
              )}
            </div>
          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              S'inscrire
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
