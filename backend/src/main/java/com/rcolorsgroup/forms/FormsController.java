package com.rcolorsgroup.forms;

import static com.rcolorsgroup.forms.FormRules.trim;

import com.rcolorsgroup.config.ApiProblem;
import com.rcolorsgroup.config.RateLimiter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.time.Duration;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * The site's forms, posted as application/x-www-form-urlencoded. Each saved submission
 * emails and WhatsApps the team, so bots are kept out: the hidden "bot-field" must stay
 * empty, and one IP can send 10 submissions an hour across the three forms.
 */
@RestController
@RequestMapping(path = "/api", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
public class FormsController {
    private final ContactMessageRepository contacts;
    private final EstateEnquiryRepository enquiries;
    private final PropertySellRequestRepository sellRequests;
    private final Notifier notifier;
    private final RateLimiter submissions = new RateLimiter(10, Duration.ofHours(1));

    public FormsController(ContactMessageRepository contacts, EstateEnquiryRepository enquiries,
            PropertySellRequestRepository sellRequests, Notifier notifier) {
        this.contacts = contacts;
        this.enquiries = enquiries;
        this.sellRequests = sellRequests;
        this.notifier = notifier;
    }

    @PostMapping("/contact")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> contact(@Valid @ModelAttribute ContactForm form,
            @RequestParam(name = "bot-field", required = false) String bot, HttpServletRequest request) {
        if (isBot(bot)) return Map.of("id", 0);
        String ip = guard(request);
        ContactMessage saved = contacts.save(new ContactMessage(
                trim(form.name()), form.phone(), trim(form.email()), form.business(), trim(form.message())));
        notifier.send("New contact message from " + saved.getName(), """
                Name: %s
                Phone: %s
                Email: %s
                Business: %s

                %s
                """.formatted(saved.getName(), saved.getPhone(), saved.getEmail(), saved.getBusiness(), saved.getMessage()));
        submissions.record(ip);
        return Map.of("id", saved.getId());
    }

    @PostMapping("/estate/enquiries")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> enquiry(@Valid @ModelAttribute EnquiryForm form,
            @RequestParam(name = "bot-field", required = false) String bot, HttpServletRequest request) {
        if (isBot(bot)) return Map.of("id", 0);
        String ip = guard(request);
        EstateEnquiry saved = enquiries.save(new EstateEnquiry(
                trim(form.name()), form.phone(), trim(form.email()), form.interest(), trim(form.message()),
                trim(form.listing()), trim(form.city()), trim(form.page())));
        notifier.send("New estate enquiry from " + saved.getName(), """
                Name: %s
                Phone: %s
                Email: %s
                Interest: %s
                Listing: %s
                City: %s
                Page: %s

                %s
                """.formatted(saved.getName(), saved.getPhone(), saved.getEmail(), saved.getInterest(),
                saved.getListing(), saved.getCity(), saved.getPage(), saved.getMessage()));
        submissions.record(ip);
        return Map.of("id", saved.getId());
    }

    @PostMapping("/estate/sell-requests")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> sellRequest(@Valid @ModelAttribute SellRequestForm form,
            @RequestParam(name = "bot-field", required = false) String bot, HttpServletRequest request) {
        if (isBot(bot)) return Map.of("id", 0);
        String ip = guard(request);
        PropertySellRequest saved = sellRequests.save(new PropertySellRequest(
                trim(form.name()), form.phone(), trim(form.email()), form.propertyType(), trim(form.location()),
                trim(form.area()), trim(form.price()), trim(form.message()), trim(form.city()), trim(form.page())));
        notifier.send("New property to sell from " + saved.getName(), """
                Name: %s
                Phone: %s
                Email: %s
                Property type: %s
                Location: %s
                Area: %s
                Expected price: %s
                City: %s
                Page: %s

                %s
                """.formatted(saved.getName(), saved.getPhone(), saved.getEmail(), saved.getPropertyType(),
                saved.getLocation(), saved.getArea(), saved.getPrice(), saved.getCity(), saved.getPage(), saved.getMessage()));
        submissions.record(ip);
        return Map.of("id", saved.getId());
    }

    /** Bots fill the hidden field; answer as if it worked and keep nothing */
    private static boolean isBot(String bot) {
        return !trim(bot).isEmpty();
    }

    /** The caller's IP, once it's under the hourly limit */
    private String guard(HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        if (submissions.isBlocked(ip)) {
            throw new ApiProblem(HttpStatus.TOO_MANY_REQUESTS, "form", "We've received several messages from your network. Please try again in an hour, or call us.");
        }
        return ip;
    }
}
