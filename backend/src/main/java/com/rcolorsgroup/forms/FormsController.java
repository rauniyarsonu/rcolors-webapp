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

/** The site's two forms, posted as application/x-www-form-urlencoded */
@RestController
@RequestMapping(path = "/api", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
public class FormsController {
    private final ContactMessageRepository contacts;
    private final EstateEnquiryRepository enquiries;
    private final Notifier notifier;

    public FormsController(ContactMessageRepository contacts, EstateEnquiryRepository enquiries, Notifier notifier) {
        this.contacts = contacts;
        this.enquiries = enquiries;
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
}
