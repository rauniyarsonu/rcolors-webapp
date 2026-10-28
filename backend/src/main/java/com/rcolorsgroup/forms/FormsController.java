package com.rcolorsgroup.forms;

import static com.rcolorsgroup.forms.FormRules.trim;

import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** The site's forms, posted as application/x-www-form-urlencoded */
@RestController
@RequestMapping(path = "/api", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
public class FormsController {
    private final ContactMessageRepository contacts;
    private final EstateEnquiryRepository enquiries;
    private final PropertySellRequestRepository sellRequests;
    private final Notifier notifier;

    public FormsController(ContactMessageRepository contacts, EstateEnquiryRepository enquiries,
            PropertySellRequestRepository sellRequests, Notifier notifier) {
        this.contacts = contacts;
        this.enquiries = enquiries;
        this.sellRequests = sellRequests;
        this.notifier = notifier;
    }

    @PostMapping("/contact")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> contact(@Valid @ModelAttribute ContactForm form) {
        ContactMessage saved = contacts.save(new ContactMessage(
                trim(form.name()), form.phone(), trim(form.email()), form.business(), trim(form.message())));
        notifier.send("New contact message from " + saved.getName(), """
                Name: %s
                Phone: %s
                Email: %s
                Business: %s

                %s
                """.formatted(saved.getName(), saved.getPhone(), saved.getEmail(), saved.getBusiness(), saved.getMessage()));
        return Map.of("id", saved.getId());
    }

    @PostMapping("/estate/enquiries")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> enquiry(@Valid @ModelAttribute EnquiryForm form) {
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
        return Map.of("id", saved.getId());
    }

    @PostMapping("/estate/sell-requests")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> sellRequest(@Valid @ModelAttribute SellRequestForm form) {
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
        return Map.of("id", saved.getId());
    }
}
