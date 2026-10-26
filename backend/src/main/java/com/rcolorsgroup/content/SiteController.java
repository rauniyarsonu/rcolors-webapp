package com.rcolorsgroup.content;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.List;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/** Site-wide content that used to be hardcoded in React components */
@RestController
@RequestMapping("/api")
@Transactional(readOnly = true)
public class SiteController {
    public static final Set<String> BUSINESSES = Set.of("construction", "r-colors", "estate");

    private final TestimonialRepository testimonials;
    private final SiteSettingsRepository settings;
    private final HeroSlideRepository slides;
    private final HomeStatRepository stats;
    private final BusinessSectionRepository sections;
    private final BusinessServiceRepository services;

    public SiteController(TestimonialRepository testimonials, SiteSettingsRepository settings, HeroSlideRepository slides,
                          HomeStatRepository stats, BusinessSectionRepository sections, BusinessServiceRepository services) {
        this.testimonials = testimonials;
        this.settings = settings;
        this.slides = slides;
        this.stats = stats;
        this.sections = sections;
        this.services = services;
    }

    public record TestimonialView(Long id, String quote, String name, String role, String company, String city,
                                  String business, String photo, Integer rating) {
        static TestimonialView of(Testimonial t) {
            return new TestimonialView(t.getId(), t.getQuote(), t.getName(), t.getRole(), t.getCompany(), t.getCity(),
                    t.getBusiness(), t.getPhoto(), t.getRating());
        }
    }

    /** Same shape as COMPANY.address in frontend/src/config/company.ts */
    public record Address(@JsonProperty("short") String shortText, String full) {}

    public record Company(String name, List<String> phones, String email, Address address, JsonNode social) {}

    public record Slide(String image, String title, String subtitle, String position) {}

    public record Stat(int value, String suffix, String label) {}

    /** Company is null only before the first seed */
    public record Site(Company company, List<Slide> heroSlides, List<Stat> stats) {}

    public record Hero(String title, String subtitle, String text, String image, String imageAlt) {}

    public record Intro(String title, List<String> paragraphs, String image, String imageAlt) {}

    public record Service(String title, String tagline, String description, String scopeBadge, String image, String imageAlt,
                          List<String> capabilities, String ctaText, String ctaHref, String icon) {
        static Service of(BusinessService s) {
            return new Service(s.getTitle(), s.getTagline(), s.getDescription(), s.getScopeBadge(), s.getImage(), s.getImageAlt(),
                    s.getCapabilities(), s.getCtaText(), s.getCtaHref(), s.getIcon());
        }
    }

    public record Business(String key, Hero hero, Intro intro, String servicesTitle, String servicesSubtitle,
                           List<Service> services, JsonNode blocks) {}

    /** Published testimonials in display order; ?business= narrows to one business */
    @GetMapping("/testimonials")
    public List<TestimonialView> testimonials(@RequestParam(required = false) String business) {
        List<Testimonial> list = business == null || business.isBlank()
                ? testimonials.findByPublishedTrueOrderBySortOrderAscIdAsc()
                : testimonials.findByPublishedTrueAndBusinessOrderBySortOrderAscIdAsc(business);
        return list.stream().map(TestimonialView::of).toList();
    }

    @GetMapping("/site")
    public Site site() {
        Company company = settings.findFirstByOrderByIdAsc()
                .map(s -> new Company(s.getCompanyName(), s.getPhones(), s.getEmail(),
                        new Address(s.getAddressShort(), s.getAddressFull()), s.getSocial()))
                .orElse(null);
        return new Site(
                company,
                slides.findByPublishedTrueOrderBySortOrderAscIdAsc().stream()
                        .map(s -> new Slide(s.getImage(), s.getTitle(), s.getSubtitle(), s.getPosition()))
                        .toList(),
                stats.findByPublishedTrueOrderBySortOrderAscIdAsc().stream()
                        .map(s -> new Stat(s.getValue(), s.getSuffix(), s.getLabel()))
                        .toList());
    }

    @GetMapping("/businesses/{key}")
    public Business business(@PathVariable String key) {
        BusinessSection b = BUSINESSES.contains(key) ? sections.findByKeyAndPublishedTrue(key).orElse(null) : null;
        if (b == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No business " + key);
        return new Business(
                b.getKey(),
                new Hero(b.getHeroTitle(), b.getHeroSubtitle(), b.getHeroText(), b.getHeroImage(), b.getHeroImageAlt()),
                new Intro(b.getIntroTitle(), b.getIntroParagraphs(), b.getIntroImage(), b.getIntroImageAlt()),
                b.getServicesTitle(),
                b.getServicesSubtitle(),
                services.findByBusinessKeyAndPublishedTrueOrderBySortOrderAscIdAsc(key).stream().map(Service::of).toList(),
                b.getBlocks());
    }
}
