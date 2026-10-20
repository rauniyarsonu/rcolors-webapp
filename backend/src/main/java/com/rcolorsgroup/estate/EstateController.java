package com.rcolorsgroup.estate;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/estate")
public class EstateController {
    private final EstateService estate;

    public EstateController(EstateService estate) {
        this.estate = estate;
    }

    @GetMapping("/cities")
    public List<City> cities() {
        return estate.cities();
    }

    @GetMapping("/cities/{slug}")
    public CityBundle city(@PathVariable String slug) {
        CityBundle bundle = estate.bundle(slug);
        if (bundle == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No city " + slug);
        return bundle;
    }
}
