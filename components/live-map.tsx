"use client";
import React, { useState, useMemo } from "react";
import Map, { Marker, Popup, NavigationControl, ScaleControl } from "react-map-gl";
import { mockHazardReports, mockCoastalReports, mockSocialMediaPosts } from "@/data"; 
import { HazardReport, CoastalHazardReport, SocialMediaPost } from "@/types";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = "pk.eyJ1IjoicHJha2FzaHJhaiIsImEiOiJjbWY5ZGViNXEwMTBtMmlzY3FtNm9uemJiIn0.RdPGguDrunvMmUDKxK597Q";

const severityColors = {
  low: "#6B7280",
  medium: "#F59E0B",
  high: "#F97316",
  critical: "#EF4444",
};

const hazardIcons = {
  cyclone: "🌪️",
  tsunami: "🌊",
  oil_spill: "🛢️",
  marine_debris: "🗑️",
  weather: "⛈️",
  storm_surge: "🌊",
  other: "⚠️",
};

export default function LiveMap() {
  const [selectedItem, setSelectedItem] = useState<HazardReport | CoastalHazardReport | SocialMediaPost | null>(null);
  const [viewState, setViewState] = useState({
    longitude: 77.209,
    latitude: 28.6139,
    zoom: 5,
  });

  // Hazard + Coastal Reports
  const hazardMarkers = useMemo(
    () =>
      [...mockHazardReports, ...mockCoastalReports].map((report) => (
        <Marker
          key={report.id}
          longitude={report.location.longitude}
          latitude={report.location.latitude}
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setSelectedItem(report);
          }}
        >
          <div
            className="relative cursor-pointer transform hover:scale-110 transition-transform"
            style={{ width: "40px", height: "40px" }}
          >
            {/* Ping for critical hazards */}
            {"severity" in report && report.severity === "critical" && (
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{ backgroundColor: severityColors[report.severity], opacity: 0.4 }}
              />
            )}
            <div
              className="w-full h-full rounded-full flex items-center justify-center shadow-lg border-2 border-white"
              style={{
                backgroundColor: "severity" in report ? severityColors[report.severity] : "#3B82F6",
              }}
            >
              <span className="text-lg" role="img" aria-label={"type" in report ? report.type : "hazard"}>
                {"type" in report ? hazardIcons[report.type] || "⚠️" : "📍"}
              </span>
            </div>
          </div>
        </Marker>
      )),
    []
  );

  // Social Media Markers
  const socialMarkers = useMemo(
    () =>
      mockSocialMediaPosts
        .filter((post) => post.geoTagged && post.location)
        .map((post) => (
          <Marker
            key={post.id}
            longitude={post.location!.longitude}
            latitude={post.location!.latitude}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedItem(post);
            }}
          >
            <div
              className="relative cursor-pointer transform hover:scale-110 transition-transform"
              style={{ width: "30px", height: "30px" }}
            >
              <div className="w-full h-full rounded-full flex items-center justify-center shadow-lg border-2 border-white bg-blue-500">
                💬
              </div>
            </div>
          </Marker>
        )),
    []
  );

  return (
    <div className="w-full h-screen relative">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        <NavigationControl position="top-right" />
        <ScaleControl position="bottom-left" />
        {hazardMarkers}
        {socialMarkers}

        {/* Dynamic Popup */}
        {selectedItem && (
          <Popup
            longitude={
              "location" in selectedItem ? selectedItem.location.longitude : 77.209
            }
            latitude={
              "location" in selectedItem ? selectedItem.location.latitude : 28.6139
            }
            anchor="bottom"
            onClose={() => setSelectedItem(null)}
          >
            <div className="p-3 text-sm">
              {"content" in selectedItem ? (
                <>
                  <h3 className="font-semibold">{selectedItem.platform.toUpperCase()} Post</h3>
                  <p>{selectedItem.content}</p>
                  <p>
                    <strong>Author:</strong> {selectedItem.author.username}
                  </p>
                  <p>
                    <strong>Credibility:</strong> {selectedItem.credibilityScore}
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-semibold">{selectedItem.title}</h3>
                  <p>{selectedItem.description}</p>
                  {"severity" in selectedItem && (
                    <p>
                      <strong>Severity:</strong> {selectedItem.severity}
                    </p>
                  )}
                  <p>
                    <strong>Status:</strong>{" "}
                    {"status" in selectedItem ? selectedItem.status : "pending"}
                  </p>
                  <p>
                    <strong>Source:</strong>{" "}
                    {"source" in selectedItem ? selectedItem.source : "unknown"}
                  </p>
                </>
              )}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
