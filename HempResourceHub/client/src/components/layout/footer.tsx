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
    <footer className="bg-black/80 backdrop-blur-md text-white relative z-20" data-oid="_edxfl8">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        data-oid="w2t-67z"
      >
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
          data-oid="574x9et"
        >
          <div data-oid="u87jru.">
            <h3
              className="text-xl font-heading font-bold mb-4"
              data-oid="vm0mlot"
            >
              HempDB
            </h3>
            <p
              className="text-neutral-light mb-6"
              data-oid="c12ao.1"
            >
              A comprehensive database of industrial hemp applications across
              industries, showcasing the versatility and potential of this
              remarkable plant.
            </p>
            <div className="flex space-x-4" data-oid="zqh1pf7">
              <a
                href="#"
                className="text-neutral-light hover:text-white transition-colors"
                data-oid="go6kms4"
              >
                <Facebook className="h-6 w-6" data-oid="772b.k:" />
              </a>
              <a
                href="#"
                className="text-neutral-light hover:text-white transition-colors"
                data-oid="qpfdh6a"
              >
                <Twitter className="h-6 w-6" data-oid="dxg3107" />
              </a>
              <a
                href="#"
                className="text-neutral-light hover:text-white transition-colors"
                data-oid=":s3:z2m"
              >
                <Instagram className="h-6 w-6" data-oid="e..3erv" />
              </a>
            </div>
          </div>

          <div data-oid="5p99y2k">
            <h3
              className="text-lg font-heading font-medium mb-4"
              data-oid="5gpb.h0"
            >
              Quick Links
            </h3>
            <ul className="space-y-3" data-oid="9saa86c">
              <li data-oid="ubx7pf4">
                <Link href="/" data-oid="kyns.np">
                  <div
                    className="text-neutral-light hover:text-white transition-colors cursor-pointer"
                    data-oid=":0n5u62"
                  >
                    Home
                  </div>
                </Link>
              </li>
              <li data-oid="xhs08i-">
                <Link href="/about" data-oid="qve.3oe">
                  <div
                    className="text-neutral-light hover:text-white transition-colors cursor-pointer"
                    data-oid="7m4hzg6"
                  >
                    About Hemp
                  </div>
                </Link>
              </li>
              <li data-oid="kyvrumb">
                <Link href="/plant-types" data-oid=":0ci1nd">
                  <div
                    className="text-neutral-light hover:text-white transition-colors cursor-pointer"
                    data-oid="bj3tq31"
                  >
                    Plant Types
                  </div>
                </Link>
              </li>
              <li data-oid="5hq52qv">
                <Link href="/plant-parts" data-oid="r00dmq7">
                  <div
                    className="text-neutral-light hover:text-white transition-colors cursor-pointer"
                    data-oid="a7tv0bx"
                  >
                    Parts of Plant
                  </div>
                </Link>
              </li>
              <li data-oid="vvrnx1n">
                <Link href="/industries" data-oid="j25og0e">
                  <div
                    className="text-neutral-light hover:text-white transition-colors cursor-pointer"
                    data-oid="q.dipeb"
                  >
                    Industries
                  </div>
                </Link>
              </li>
              <li data-oid="sxut4xk">
                <Link href="/legal" data-oid="r45cthc">
                  <div
                    className="text-neutral-light hover:text-white transition-colors cursor-pointer"
                    data-oid="wytqr3o"
                  >
                    Legal Status
                  </div>
                </Link>
              </li>
              <li data-oid="dad9t7i">
                <Link href="/resources" data-oid="jq3.igj">
                  <div
                    className="text-neutral-light hover:text-white transition-colors cursor-pointer"
                    data-oid="dhq3u9p"
                  >
                    Research Resources
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          <div data-oid="u05f84g">
            <h3
              className="text-lg font-heading font-medium mb-4"
              data-oid="tocyy0e"
            >
              Subscribe
            </h3>
            <p
              className="text-neutral-light mb-4"
              data-oid="bpkelr1"
            >
              Join our newsletter to receive updates on new hemp applications
              and industry developments.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="mb-4"
              data-oid=":-kod8l"
            >
              <div className="flex max-w-md" data-oid="ldq1th0">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow min-w-0 bg-neutral-darkest text-white px-4 py-2 rounded-l-md border border-neutral-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  data-oid="gy0n_hy"
                />

                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white font-medium px-4 py-2 rounded-r-md transition-colors"
                  data-oid="7-0e694"
                >
                  Subscribe
                </Button>
              </div>
            </form>
            <p
              className="text-xs text-neutral-medium"
              data-oid="h1h0vvt"
            >
              By subscribing, you agree to our Privacy Policy and consent to
              receive updates from HempDB.
            </p>
          </div>
        </div>

        <div
          className="mt-12 pt-8 border-t border-neutral-dark text-neutral-medium flex flex-col sm:flex-row justify-between items-center"
          data-oid="wd49fe7"
        >
          <p className="text-sm" data-oid="lu-e6:y">
            © {new Date().getFullYear()} HempDB. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0 flex space-x-6" data-oid="sa28bh0">
            <Link href="/privacy" data-oid="ju7u4lt">
              <div
                className="text-sm text-neutral-medium hover:text-white transition-colors cursor-pointer"
                data-oid=".pom2fn"
              >
                Privacy Policy
              </div>
            </Link>
            <Link href="/terms" data-oid="u36.:ki">
              <div
                className="text-sm text-neutral-medium hover:text-white transition-colors cursor-pointer"
                data-oid="us4yil8"
              >
                Terms of Service
              </div>
            </Link>
            <Link href="/contact" data-oid="tq4rraj">
              <div
                className="text-sm text-neutral-medium hover:text-white transition-colors cursor-pointer"
                data-oid="o.ql8ms"
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
