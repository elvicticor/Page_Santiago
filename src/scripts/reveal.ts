import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

mm.add(
	{
		motionOK: "(prefers-reduced-motion: no-preference)",
		motionReduce: "(prefers-reduced-motion: reduce)",
	},
	(context) => {
		const { motionOK } = context.conditions as { motionOK: boolean };
		const items = gsap.utils.toArray<HTMLElement>(".reveal");

		if (!motionOK) {
			gsap.set(items, { opacity: 1, y: 0 });
			return;
		}

		ScrollTrigger.batch(items, {
			start: "top 88%",
			onEnter: (batch) =>
				gsap.to(batch, {
					opacity: 1,
					y: 0,
					duration: 0.8,
					ease: "power3.out",
					stagger: 0.12,
					overwrite: true,
				}),
			once: true,
		});
	},
);

const navEl = document.querySelector("nav");
if (navEl) {
	ScrollTrigger.create({
		start: "top -80",
		onUpdate: (self) => {
			navEl.classList.toggle("scrolled", self.scroll() > 80);
		},
	});
}
