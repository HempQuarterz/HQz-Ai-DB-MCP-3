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
    <footer className="bg-neutral-darkest text-white" data-oid="rftc1.:">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        data-oid="zm_r9d_"
      >
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
          data-oid="s0eyui."
        >
          <div data-oid="ghs7vax">
            <h3
              className="text-xl font-heading font-bold mb-4 text-outline-white"
              data-oid="p31ila0"
            >
              HempDB
            </h3>
            <p
              className="text-neutral-light mb-6 text-outline-white"
              data-oid="kmot7mf"
            >
              A comprehensive database of industrial hemp applications across
              industries, showcasing the versatility and potential of this
              remarkable plant.
            </p>
            <div className="flex space-x-4" data-oid="c.65bk0">
              <a
                href="#"
                className="text-neutral-light hover:text-white transition-colors"
                data-oid="q5h4oo3"
              >
                <Facebook className="h-6 w-6" data-oid="0bks0jh" />
              </a>
              <a
                href="#"
                className="text-neutral-light hover:text-white transition-colors"
                data-oid="gj7vw13"
              >
                <Twitter className="h-6 w-6" data-oid="wdqmhxl" />
              </a>
              <a
                href="#"
                className="text-neutral-light hover:text-white transition-colors"
                data-oid="u:yg-1q"
              >
                <Instagram className="h-6 w-6" data-oid="lusf7jg" />
              </a>
            </div>
          </div>

          <div data-oid="wp5ow.u">
            <h3
              className="text-lg font-heading font-medium mb-4 text-outline-white"
              data-oid="gaw0b6q"
            >
              Quick Links
            </h3>
            <ul className="space-y-3" data-oid="7hq0l:_">
              <li data-oid="mxp-z8c">
                <Link href="/" data-oid="bzqdpu:">
                  <div
                    className="text-neutral-light hover:text-white transition-colors text-outline-white cursor-pointer"
                    data-oid="gx-tt.k"
                  >
                    Home
                  </div>
                </Link>
              </li>
              <li data-oid="3ccn5qs">
                <Link href="/about" data-oid="b-4zaz2">
                  <div
                    className="text-neutral-light hover:text-white transition-colors text-outline-white cursor-pointer"
                    data-oid="f487dfo"
                  >
                    About Hemp
                  </div>
                </Link>
              </li>
              <li data-oid="95506v2">
                <Link href="/plant-types" data-oid="yphrr9-">
                  <div
                    className="text-neutral-light hover:text-white transition-colors text-outline-white cursor-pointer"
                    data-oid="j1aafsz"
                  >
                    Plant Types
                  </div>
                </Link>
              </li>
              <li data-oid="2jit5in">
                <Link href="/plant-parts" data-oid="w.q7qc1">
                  <div
                    className="text-neutral-light hover:text-white transition-colors text-outline-white cursor-pointer"
                    data-oid="n8qql47"
                  >
                    Parts of Plant
                  </div>
                </Link>
              </li>
              <li data-oid="xwp1mm3">
                <Link href="/industries" data-oid=".a1j6r1">
                  <div
                    className="text-neutral-light hover:text-white transition-colors text-outline-white cursor-pointer"
                    data-oid="x5mrjll"
                  >
                    Industries
                  </div>
                </Link>
              </li>
              <li data-oid="j_ag5f3">
                <Link href="/legal" data-oid="3o.rvwj">
                  <div
                    className="text-neutral-light hover:text-white transition-colors text-outline-white cursor-pointer"
                    data-oid="4:hqeed"
                  >
                    Legal Status
                  </div>
                </Link>
              </li>
              <li data-oid="3ceplwa">
                <Link href="/resources" data-oid="vzp8.d_">
                  <div
                    className="text-neutral-light hover:text-white transition-colors text-outline-white cursor-pointer"
                    data-oid="uxycq.3"
                  >
                    Research Resources
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          <div data-oid=".82:ac9">
            <h3
              className="text-lg font-heading font-medium mb-4 text-outline-white"
              data-oid="9rb.jsw"
            >
              Subscribe
            </h3>
            <p
              className="text-neutral-light mb-4 text-outline-white"
              data-oid="eav0z:w"
            >
              Join our newsletter to receive updates on new hemp applications
              and industry developments.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="mb-4"
              data-oid="8:5-hb:"
            >
              <div className="flex max-w-md" data-oid="0nx::53">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow min-w-0 bg-neutral-darkest text-white px-4 py-2 rounded-l-md border border-neutral-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  data-oid="g01mg2j"
                />

                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white font-medium px-4 py-2 rounded-r-md transition-colors"
                  data-oid="s8ey.x5"
                >
                  Subscribe
                </Button>
              </div>
            </form>
            <p
              className="text-xs text-neutral-medium text-outline-white"
              data-oid="c-ozb0y"
            >
              By subscribing, you agree to our Privacy Policy and consent to
              receive updates from HempDB.
            </p>
          </div>
        </div>

        <div
          className="mt-12 pt-8 border-t border-neutral-dark text-neutral-medium flex flex-col sm:flex-row justify-between items-center"
          data-oid="m89ak0j"
        >
          <p className="text-sm text-outline-white" data-oid="jf2q5eg">
            © {new Date().getFullYear()} HempDB. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0 flex space-x-6" data-oid="irigsd7">
            <Link href="/privacy" data-oid="5_q:adu">
              <div
                className="text-sm text-neutral-medium hover:text-white transition-colors text-outline-white cursor-pointer"
                data-oid="4237anh"
              >
                Privacy Policy
              </div>
            </Link>
            <Link href="/terms" data-oid="3w3-if8">
              <div
                className="text-sm text-neutral-medium hover:text-white transition-colors text-outline-white cursor-pointer"
                data-oid="rlrz-4h"
              >
                Terms of Service
              </div>
            </Link>
            <Link href="/contact" data-oid="l7pb-c4">
              <div
                className="text-sm text-neutral-medium hover:text-white transition-colors text-outline-white cursor-pointer"
                data-oid="2j30b-7"
              >
                Contact
              </div>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
