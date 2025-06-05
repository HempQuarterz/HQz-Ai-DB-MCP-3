import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription");
  };

  return (
    <footer className="bg-neutral-darkest text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-heading font-bold mb-4 text-outline-white">HempDB</h3>
            <p className="text-neutral-light mb-6 text-outline-white">
              A comprehensive database of industrial hemp applications across industries, showcasing the versatility and potential of this remarkable plant.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-light hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-light hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-light hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-heading font-medium mb-4 text-outline-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/">
                  <div className="text-neutral-light hover:text-white transition-colors text-outline-white cursor-pointer">Home</div>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <div className="text-neutral-light hover:text-white transition-colors text-outline-white cursor-pointer">About Hemp</div>
                </Link>
              </li>
              <li>
                <Link href="/plant-types">
                  <div className="text-neutral-light hover:text-white transition-colors text-outline-white cursor-pointer">Plant Types</div>
                </Link>
              </li>
              <li>
                <Link href="/plant-parts">
                  <div className="text-neutral-light hover:text-white transition-colors text-outline-white cursor-pointer">Parts of Plant</div>
                </Link>
              </li>
              <li>
                <Link href="/industries">
                  <div className="text-neutral-light hover:text-white transition-colors text-outline-white cursor-pointer">Industries</div>
                </Link>
              </li>
              <li>
                <Link href="/legal">
                  <div className="text-neutral-light hover:text-white transition-colors text-outline-white cursor-pointer">Legal Status</div>
                </Link>
              </li>
              <li>
                <Link href="/resources">
                  <div className="text-neutral-light hover:text-white transition-colors text-outline-white cursor-pointer">Research Resources</div>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-heading font-medium mb-4 text-outline-white">Subscribe</h3>
            <p className="text-neutral-light mb-4 text-outline-white">
              Join our newsletter to receive updates on new hemp applications and industry developments.
            </p>
            <form onSubmit={handleSubscribe} className="mb-4">
              <div className="flex max-w-md">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow min-w-0 bg-neutral-darkest text-white px-4 py-2 rounded-l-md border border-neutral-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary-dark text-white font-medium px-4 py-2 rounded-r-md transition-colors"
                >
                  Subscribe
                </Button>
              </div>
            </form>
            <p className="text-xs text-neutral-medium text-outline-white">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from HempDB.
            </p>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-neutral-dark text-neutral-medium flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-outline-white">© {new Date().getFullYear()} HempDB. All rights reserved.</p>
          <div className="mt-4 sm:mt-0 flex space-x-6">
            <Link href="/privacy">
              <div className="text-sm text-neutral-medium hover:text-white transition-colors text-outline-white cursor-pointer">Privacy Policy</div>
            </Link>
            <Link href="/terms">
              <div className="text-sm text-neutral-medium hover:text-white transition-colors text-outline-white cursor-pointer">Terms of Service</div>
            </Link>
            <Link href="/contact">
              <div className="text-sm text-neutral-medium hover:text-white transition-colors text-outline-white cursor-pointer">Contact</div>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
