import React, { useState } from "react";
import axios from "axios";

const Register = () => {
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        telephone: "",
        email: "",
        password: "",
        password_confirmation: "",
        boutique: "",
        cin: "",
        banque: "AL BARID BANK",
        rib: "",
        ville: "CASABLANCA",
        adresse: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
        
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Nom et prénom validation
        if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
        if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";

        // Validation téléphone (format marocain)
        const phoneRegex = /^\+212[0-9]{9}$/;
        if (!formData.telephone) {
            newErrors.telephone = "Le numéro de téléphone est requis";
        } else if (!phoneRegex.test(formData.telephone)) {
            newErrors.telephone = "Format invalide (+212 suivi de 9 chiffres)";
        }

        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = "L'email est requis";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Format d'email invalide";
        }

        // Validation mot de passe
        if (!formData.password) {
            newErrors.password = "Le mot de passe est requis";
        } else if (formData.password.length < 8) {
            newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
        } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = "Le mot de passe doit contenir au moins une majuscule";
        } else if (!/[0-9]/.test(formData.password)) {
            newErrors.password = "Le mot de passe doit contenir au moins un chiffre";
        }

        // Confirmation mot de passe
        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = "Les mots de passe ne correspondent pas";
        }

        // Validation RIB (24 chiffres pour le Maroc)
        const ribRegex = /^[0-9]{24}$/;
        if (!formData.rib) {
            newErrors.rib = "Le RIB est requis";
        } else if (!ribRegex.test(formData.rib)) {
            newErrors.rib = "Le RIB doit contenir exactement 24 chiffres";
        }

        // Autres validations
        if (!formData.boutique.trim()) newErrors.boutique = "Le nom de boutique est requis";
        if (!formData.cin.trim()) newErrors.cin = "Le CIN est requis";

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            // Scroll to first error
            const firstErrorField = document.querySelector(".border-red-500");
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstErrorField.focus();
            }
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            // Make API call to Laravel backend
            const response = await axios.post(
                "http://127.0.0.1:8000/api/register",
                formData
            );

            console.log("Registration successful:", response.data);
            setSubmitSuccess(true);
            
            // Redirect after successful registration (can be uncommented when ready)
            // setTimeout(() => {
            //     window.location.href = "/login";
            // }, 2000);

        } catch (error) {
            console.error("Registration error:", error);

            // Handle API validation errors
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ 
                    general: "Une erreur s'est produite lors de l'inscription. Veuillez réessayer ou contacter le support." 
                });
            }
            
            // Scroll to error message
            const errorElement = document.querySelector(".text-red-500");
            if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper function to generate input field classes
    const getInputClasses = (fieldName) => {
        return `mt-1 block w-full border ${
            errors[fieldName] ? "border-red-500" : "border-gray-300"
        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150`;
    };

    if (submitSuccess) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                        <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-2xl font-extrabold text-gray-900">Inscription réussie</h2>
                    <p className="mt-2 text-gray-600">
                        Votre compte a été créé avec succès. Vous allez être redirigé vers la page de connexion.
                    </p>
                    <div className="mt-6">
                        <button
                            onClick={() => window.location.href = "/login"}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Aller à la connexion
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <div className="mb-8 border-b pb-4">
                    <p className="text-blue-600 font-medium">Création de compte</p>
                    <h2 className="text-3xl font-bold text-gray-800 mt-2">
                        Livrer avec Bolt
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Complétez le formulaire ci-dessous pour créer votre compte professionnel
                    </p>
                </div>

                {errors.general && (
                    <div className="mb-6 bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{errors.general}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                        <h3 className="text-lg font-medium text-blue-800 mb-2">Informations personnelles</h3>
                        
                        {/* Nom et Prénom */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="nom"
                                    className="block text-sm font-medium text-gray-700 mb-1"
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
                                    className={getInputClasses("nom")}
                                />
                                {errors.nom && (
                                    <p className="mt-1 text-sm text-red-500">{errors.nom}</p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="prenom"
                                    className="block text-sm font-medium text-gray-700 mb-1"
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
                                    className={getInputClasses("prenom")}
                                />
                                {errors.prenom && (
                                    <p className="mt-1 text-sm text-red-500">{errors.prenom}</p>
                                )}
                            </div>
                        </div>

                        {/* CIN */}
                        <div className="mt-4">
                            <label
                                htmlFor="cin"
                                className="block text-sm font-medium text-gray-700 mb-1"
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
                                placeholder="Carte d'identité nationale"
                                className={getInputClasses("cin")}
                            />
                            {errors.cin && (
                                <p className="mt-1 text-sm text-red-500">{errors.cin}</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Coordonnées de contact</h3>
                        
                        {/* Téléphone et Email */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="telephone"
                                    className="block text-sm font-medium text-gray-700 mb-1"
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
                                    placeholder="+212612345678"
                                    className={getInputClasses("telephone")}
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Format: +212 suivi de 9 chiffres
                                </p>
                                {errors.telephone && (
                                    <p className="mt-1 text-sm text-red-500">{errors.telephone}</p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-1"
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
                                    className={getInputClasses("email")}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        {/* Adresse */}
                        <div className="mt-4">
                            <label
                                htmlFor="adresse"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Adresse complète
                            </label>
                            <input
                                type="text"
                                id="adresse"
                                name="adresse"
                                value={formData.adresse}
                                onChange={handleChange}
                                placeholder="Adresse complète"
                                className={getInputClasses("adresse")}
                            />
                            {errors.adresse && (
                                <p className="mt-1 text-sm text-red-500">{errors.adresse}</p>
                            )}
                        </div>

                        {/* Ville */}
                        <div className="mt-4">
                            <label
                                htmlFor="ville"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Ville <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="ville"
                                name="ville"
                                value={formData.ville}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="CASABLANCA">CASABLANCA</option>
                                <option value="RABAT">RABAT</option>
                                <option value="MARRAKECH">MARRAKECH</option>
                                <option value="ADISS">ADISS</option>
                                <option value="FES">FES</option>
                                <option value="TANGER">TANGER</option>
                                <option value="AGADIR">AGADIR</option>
                            </select>
                            {errors.ville && (
                                <p className="mt-1 text-sm text-red-500">{errors.ville}</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-blue-800 mb-2">Informations professionnelles</h3>
                        
                        {/* Boutique */}
                        <div>
                            <label
                                htmlFor="boutique"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Nom de la boutique <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="boutique"
                                name="boutique"
                                value={formData.boutique}
                                onChange={handleChange}
                                required
                                placeholder="Nom de votre commerce"
                                className={getInputClasses("boutique")}
                            />
                            {errors.boutique && (
                                <p className="mt-1 text-sm text-red-500">{errors.boutique}</p>
                            )}
                        </div>

                        {/* Banque et RIB */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-4">
                            <div>
                                <label
                                    htmlFor="banque"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Banque <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="banque"
                                    name="banque"
                                    value={formData.banque}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="AL BARID BANK">AL BARID BANK</option>
                                    <option value="BMCE">BMCE</option>
                                    <option value="BMCI">BMCI</option>
                                    <option value="ATTIJARI">ATTIJARI</option>
                                    <option value="CIH">CIH</option>
                                    <option value="SOCIETE GENERALE">SOCIETE GENERALE</option>
                                </select>
                                {errors.banque && (
                                    <p className="mt-1 text-sm text-red-500">{errors.banque}</p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="rib"
                                    className="block text-sm font-medium text-gray-700 mb-1"
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
                                    className={getInputClasses("rib")}
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    24 chiffres sans espaces
                                </p>
                                {errors.rib && (
                                    <p className="mt-1 text-sm text-red-500">{errors.rib}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Sécurité du compte</h3>
                        
                        {/* Mot de passe */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Mot de passe <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className={getInputClasses("password")}
                                />
                                <ul className="mt-1 text-xs text-gray-500 list-disc list-inside">
                                    <li>Minimum 8 caractères</li>
                                    <li>Au moins une lettre majuscule</li>
                                    <li>Au moins un chiffre</li>
                                </ul>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="password_confirmation"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Confirmez mot de passe <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    required
                                    className={getInputClasses("password_confirmation")}
                                />
                                {errors.password_confirmation && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Conditions d'utilisation */}
                    <div className="mt-4 text-sm text-gray-600">
                        En créant un compte, vous acceptez nos{" "}
                        <a href="/terms" className="text-blue-600 hover:text-blue-800">
                            Conditions d'utilisation
                        </a>{" "}
                        et notre{" "}
                        <a href="/privacy" className="text-blue-600 hover:text-blue-800">
                            Politique de confidentialité
                        </a>
                        .
                    </div>

                    {/* Submit button */}
                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                                isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Inscription en cours...
                                </>
                            ) : (
                                "Créer mon compte"
                            )}
                        </button>
                    </div>

                    {/* Login link */}
                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            Vous avez déjà un compte?{" "}
                            <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                Connectez-vous
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;