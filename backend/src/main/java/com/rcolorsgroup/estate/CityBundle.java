package com.rcolorsgroup.estate;

import com.fasterxml.jackson.databind.node.ObjectNode;
import java.util.List;

/** Everything the portal needs for one city (frontend type: CityBundle in lib/estate/schema.ts) */
public record CityBundle(
        City city,
        /* Active nodes of the city's subtree plus its ancestors */
        List<ObjectNode> locations,
        List<ObjectNode> properties,
        List<ObjectNode> projects,
        List<ObjectNode> agents) {}
