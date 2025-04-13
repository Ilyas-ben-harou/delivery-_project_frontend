import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">ProjectDelivery</h3>
                        <p className="text-gray-300 mb-4">Transforming ideas into successful project deliveries since 2010.</p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-300 hover:text-white">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-white">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-white">
                                <Linkedin size={20} />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-white">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white">
                                    Services
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white">
                                    Projects
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Our Services</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white">
                                    Project Management
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white">
                                    Consulting
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white">
                                    Implementation
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white">
                                    Training
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white">
                                    Support
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <MapPin className="mr-2 h-5 w-5 text-gray-400" />
                                <span className="text-gray-300">
                                    123 Project Street, Suite 100
                                    <br />
                                    Business City, BZ 12345
                                </span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="mr-2 h-5 w-5 text-gray-400" />
                                <span className="text-gray-300">(123) 456-7890</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="mr-2 h-5 w-5 text-gray-400" />
                                <span className="text-gray-300">info@projectdelivery.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} ProjectDelivery. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
